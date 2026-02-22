import { PayloadHandler } from 'payload'

export const validateCoupon: PayloadHandler = async (req) => {
  // 1. Parse the body from the request stream
  const body = req.json ? await req.json() : (req as any).body
  const { code, subtotal } = body || {}

  // 2. Query the coupon collection
  const result = await req.payload.find({
    collection: 'coupons',
    where: {
      code: { equals: code },
      is_active: { equals: true },
    },
  })

  const coupon = result.docs[0]

  // 3. Return errors using Response.json()
  if (!coupon) {
    return Response.json({ error: 'Invalid coupon' }, { status: 400 })
  }

  // Expiration Check
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return Response.json({ error: 'Coupon expired' }, { status: 400 })
  }

  // Minimum Order Check
  if (coupon.min_order && subtotal < coupon.min_order) {
    return Response.json({ error: 'Minimum order not met' }, { status: 400 })
  }

  // ✅ Use || 0 to ensure you're comparing a number, not null/undefined
  if (coupon.usage_limit && (coupon.used_count || 0) >= coupon.usage_limit) {
    return Response.json({ error: 'Coupon usage limit reached' }, { status: 400 })
  }

  // 4. Calculate Discount
  let discount = 0

  if (coupon.type === 'percentage') {
    discount = subtotal * (coupon.value / 100)
  } else {
    discount = coupon.value
  }

  // Ensure discount doesn't exceed subtotal (preventing negative totals)
  const finalDiscount = Math.min(discount, subtotal)

  // 5. Return success response
  return Response.json({
    discount: finalDiscount,
    coupon,
  })
}
