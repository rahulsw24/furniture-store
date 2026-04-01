import { PayloadHandler } from 'payload'
import crypto from 'crypto'

export const razorpayWebhook: PayloadHandler = async (req) => {
  console.log('--- Razorpay Webhook Received ---')

  // 1. Get the RAW body for accurate signature verification
  // We cast to 'any' or 'Request' to tell TypeScript we know this method exists
  const rawBody = await (req as any).text()
  const signature = req.headers.get('x-razorpay-signature')
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!

  if (!signature) {
    console.error('❌ Razorpay Webhook: Missing Signature Header')
    return new Response('No signature provided', { status: 400 })
  }

  // 2. Verify the signature
  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')

  if (signature !== expectedSignature) {
    console.error('❌ Razorpay Webhook: Invalid Signature')
    return new Response('Invalid signature', { status: 400 })
  }

  // Parse the body after verification
  const body = JSON.parse(rawBody)
  const event = body.event
  const payload = body.payload

  console.log(`Processing Event: ${event}`)

  // Find the Order in Payload
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

  // 3. Handle "Payment Captured" (Success)
  if (event === 'payment.captured' || event === 'order.paid') {
    const razorpayPaymentId = payload.payment.entity.id

    // Skip if already processed
    if (order.payment_status === 'paid') {
      return new Response('OK', { status: 200 })
    }

    // A. Update Stock
    for (const item of order.items) {
      const productId = typeof item.product === 'object' ? item.product.id : item.product
      const product = await req.payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (product) {
        await req.payload.update({
          collection: 'products',
          id: product.id,
          data: { stock: Math.max(0, product.stock - item.quantity) },
        })
      }
    }

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

    console.log(`✅ Order #${order.order_number} fulfilled via Webhook.`)
  }

  // 4. Handle "Payment Failed"
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
