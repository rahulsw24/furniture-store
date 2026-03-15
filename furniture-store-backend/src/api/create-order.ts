import { PayloadHandler } from 'payload'

export const createOrder: PayloadHandler = async (req) => {
  const body = req.json ? await req.json() : (req as any).body
  const { items, coupon_code, ...rest } = body

  const validatedItems = []
  const stockUpdates = []
  let subtotal = 0

  // 1. Validate Products & Stock
  for (const item of items) {
    const product = await req.payload.findByID({
      collection: 'products',
      id: item.product,
    })

    if (!product || product.stock < item.quantity) {
      return Response.json(
        { error: `Insufficient stock for ${product?.name || 'item'}` },
        { status: 400 },
      )
    }

    const itemSubtotal = product.price * item.quantity
    validatedItems.push({
      ...item,
      unit_price: product.price,
      subtotal: itemSubtotal,
    })

    subtotal += itemSubtotal
    stockUpdates.push({ id: product.id, newStock: product.stock - item.quantity })
  }

  // 2. Re-validate Coupon on Backend
  let finalDiscount = 0
  let couponId = null

  if (coupon_code) {
    const couponResult = await req.payload.find({
      collection: 'coupons',
      where: {
        code: { equals: coupon_code },
        is_active: { equals: true },
      },
    })

    const coupon = couponResult.docs[0]

    if (coupon) {
      // Basic validation checks (matching your validate-coupon logic)
      const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
      const minMet = !coupon.min_order || subtotal >= coupon.min_order
      const limitOk = !coupon.usage_limit || (coupon.used_count || 0) < coupon.usage_limit

      if (!isExpired && minMet && limitOk) {
        couponId = coupon.id
        if (coupon.type === 'percentage') {
          finalDiscount = subtotal * (coupon.value / 100)
        } else {
          finalDiscount = coupon.value
        }
        finalDiscount = Math.min(finalDiscount, subtotal)
      }
    }
  }

  const finalTotal = subtotal - finalDiscount

  // 3. Create Order
  const year = new Date().getFullYear()
  const count = await req.payload.count({ collection: 'orders' })
  const newOrderNumber = `BLT-${year}-${(count.totalDocs + 1).toString().padStart(4, '0')}-${Math.random().toString(36).substring(7).toUpperCase()}`
  const order = await req.payload.create({
    collection: 'orders',
    data: {
      ...rest,
      order_number: newOrderNumber,
      items: validatedItems,
      subtotal,
      discount: finalDiscount,
      total: finalTotal,
      coupon: couponId, // Link order to coupon for tracking
    },
  })

  // 4. Post-Order Processing: Update Stock & Coupon Count
  for (const update of stockUpdates) {
    await req.payload.update({
      collection: 'products',
      id: update.id,
      data: { stock: update.newStock },
    })
  }

  if (couponId) {
    const coupon = await req.payload.findByID({ collection: 'coupons', id: couponId })
    await req.payload.update({
      collection: 'coupons',
      id: couponId,
      data: { used_count: (coupon.used_count || 0) + 1 },
    })
  }

  return Response.json(order)
}
