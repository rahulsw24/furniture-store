import { PayloadHandler } from 'payload'
import crypto from 'crypto'
import { inngest } from '@/inngest/client'

export const razorpayWebhook: PayloadHandler = async (req) => {
  console.log('--- Razorpay Webhook Received ---')

  const rawBody = await (req as any).text()
  const signature = req.headers.get('x-razorpay-signature')
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  if (!signature) {
    console.error('❌ Razorpay Webhook: Missing Signature Header')
    return new Response('No signature provided', { status: 400 })
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  if (signature !== expectedSignature) {
    console.error('❌ Razorpay Webhook: Invalid Signature')
    return new Response('Invalid signature', { status: 400 })
  }

  const body = JSON.parse(rawBody)
  const event = body.event
  const payload = body.payload

  const razorpayOrderId = payload.payment.entity.order_id || payload.order?.entity?.id

  const orderResult = await req.payload.find({
    collection: 'orders',
    where: {
      'payment_details.razorpay_order_id': { equals: razorpayOrderId },
    },
  })

  const order = orderResult.docs[0]

  if (!order) {
    console.error(`❌ Order not found for Razorpay ID: ${razorpayOrderId}`)
    return new Response('Order not found', { status: 404 })
  }

  // 3. Handle Success Events
  if (event === 'payment.captured' || event === 'order.paid') {
    const razorpayPaymentId = payload.payment.entity.id

    if (order.payment_status === 'paid') {
      return new Response('OK', { status: 200 })
    }

    /* ---------- ✅ UPDATED: VARIANT AWARE STOCK LOGIC ---------- */
    for (const item of order.items) {
      const productId = typeof item.product === 'object' ? item.product.id : item.product

      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (!product) continue

      if (product.product_type === 'variable' && item.variantId) {
        // Find the specific variant in the product's variants array
        const variants = product.variants || []
        const updatedVariants = variants.map((v: any) =>
          v.id === item.variantId
            ? { ...v, stock: Math.max(0, (v.stock || 0) - item.quantity) }
            : v,
        )

        await req.payload.update({
          collection: 'products',
          id: productId,
          data: { variants: updatedVariants },
        })
      } else {
        // Standard logic for simple products
        await req.payload.update({
          collection: 'products',
          id: productId,
          data: { stock: Math.max(0, (product.stock || 0) - item.quantity) },
        })
      }
    }
    /* --------------------------------------------------------- */

    // B. Increment Coupon Usage
    if (order.coupon) {
      const couponId = typeof order.coupon === 'object' ? order.coupon.id : order.coupon
      const coupon = await req.payload.findByID({ collection: 'coupons', id: couponId })
      await req.payload.update({
        collection: 'coupons',
        id: couponId,
        data: { used_count: (coupon.used_count || 0) + 1 },
      })
    }

    // C. Update Order Status
    await req.payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        payment_details: {
          ...order.payment_details,
          razorpay_payment_id: razorpayPaymentId,
        },
      },
    })

    await inngest
      .send({
        name: 'order.paid',
        data: { orderId: order.id },
      })
      .catch((err) => console.error('Inngest order.paid failed:', err))

    console.log(`✅ Order #${order.order_number} fulfilled via Webhook.`)
  }

  // 4. Handle Payment Failed
  else if (event === 'payment.failed') {
    const errorDescription = payload.payment.entity.error_description
    const errorCode = payload.payment.entity.error_code

    await req.payload.update({
      collection: 'orders',
      id: order.id,
      data: {
        payment_status: 'failed',
        payment_details: {
          ...order.payment_details,
          failure_reason: errorDescription,
          error_code: errorCode,
        },
      },
    })
    console.log(`❌ Order #${order.order_number} marked as failed: ${errorDescription}`)
  }

  return new Response('OK', { status: 200 })
}
