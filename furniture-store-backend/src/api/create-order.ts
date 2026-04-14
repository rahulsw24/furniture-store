import { PayloadHandler } from 'payload'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const createOrder: PayloadHandler = async (req) => {
  const body = req.json ? await req.json() : (req as any).body
  const { items, coupon_code, ...rest } = body

  const validatedItems = []
  const stockUpdates = []
  let subtotal = 0

  // 1. Validate Products & Stock
  for (const item of items) {
    const orderItem = item as any

    const product = await req.payload.findByID({
      collection: 'products',
      id: orderItem.product,
    })

    if (!product) return Response.json({ error: `Product not found` }, { status: 400 })

    // ✅ NEW: SECURITY FIX - Get the real price from DB, don't trust frontend
    let correctPrice = product.price

    if (product.product_type === 'variable' && orderItem.variantId) {
      const variants = product.variants || []
      const variant = variants.find((v: any) => v.id === orderItem.variantId)

      if (!variant || (variant.stock || 0) < orderItem.quantity) {
        return Response.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }

      correctPrice = variant.price // Use the variant's real price

      const updatedVariants = variants.map((v: any) =>
        v.id === orderItem.variantId ? { ...v, stock: (v.stock || 0) - orderItem.quantity } : v,
      )

      stockUpdates.push({ id: product.id, data: { variants: updatedVariants } })
    } else {
      const currentStock = product.stock || 0
      if (currentStock < orderItem.quantity) {
        return Response.json({ error: `Insufficient stock` }, { status: 400 })
      }
      stockUpdates.push({ id: product.id, data: { stock: currentStock - orderItem.quantity } })
    }

    // ✅ Calculate subtotal using correctPrice from DB
    const itemSubtotal = correctPrice * orderItem.quantity

    validatedItems.push({
      product: orderItem.product,
      variantId: orderItem.variantId || null,
      product_name: orderItem.product_name,
      product_image: orderItem.product_image,
      quantity: orderItem.quantity,
      unit_price: correctPrice, // Save the REAL price
      subtotal: itemSubtotal,
    })

    subtotal += itemSubtotal
  }

  // 2. Re-validate Coupon
  let finalDiscount = 0
  let couponId = null
  if (coupon_code) {
    const couponResult = await req.payload.find({
      collection: 'coupons',
      where: { code: { equals: coupon_code }, is_active: { equals: true } },
    })
    const coupon = couponResult.docs[0]
    if (coupon) {
      const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
      const minMet = !coupon.min_order || subtotal >= coupon.min_order
      const limitOk = !coupon.usage_limit || (coupon.used_count || 0) < coupon.usage_limit

      if (!isExpired && minMet && limitOk) {
        couponId = coupon.id
        finalDiscount =
          coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value
        finalDiscount = Math.min(finalDiscount, subtotal)
      }
    }
  }

  const finalTotal = subtotal - finalDiscount

  // --- 3. Razorpay Order Generation ---
  let razorpayOrderId = null
  if (rest.payment_method === 'razorpay') {
    try {
      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(finalTotal * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      })
      razorpayOrderId = rzpOrder.id
    } catch (err) {
      console.error('Razorpay Order Creation Failed:', err)
      return Response.json({ error: 'Failed to initiate payment gateway.' }, { status: 500 })
    }
  }

  // 4. Create Order in DB
  const year = new Date().getFullYear()
  const count = await req.payload.count({ collection: 'orders' })
  const newOrderNumber = `BLT-${year}-${(count.totalDocs + 1).toString().padStart(4, '0')}`

  const order = await req.payload.create({
    collection: 'orders',
    data: {
      ...rest,
      order_number: newOrderNumber,
      items: validatedItems,
      subtotal,
      discount: finalDiscount,
      total: finalTotal,
      coupon: couponId,
      payment_details: {
        razorpay_order_id: razorpayOrderId,
      },
      payment_status: 'pending',
    },
  })

  // --- 5. Conditional Fulfillment (COD) ---
  if (rest.payment_method === 'cod') {
    for (const update of stockUpdates) {
      await req.payload.update({
        collection: 'products',
        id: update.id,
        data: update.data,
      })
    }

    if (couponId) {
      const couponDoc = await req.payload.findByID({ collection: 'coupons', id: couponId })
      await req.payload.update({
        collection: 'coupons',
        id: couponId,
        data: { used_count: (couponDoc.used_count || 0) + 1 },
      })
    }
  }

  return Response.json(order)
}
