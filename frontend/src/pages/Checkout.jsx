import React, { useState, useEffect } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { MapPin, Phone, User, Loader2, ChevronLeft, ShieldCheck, Truck, Tag, X, Ticket, Info, ChevronRight, Mail } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const Checkout = () => {
    const { detailedCart, totalPrice, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        email: user?.email || "", // Default to user email if available
    })

    // Coupon & Offers State
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [discount, setDiscount] = useState(0)
    const [isApplying, setIsApplying] = useState(false)
    const [availableCoupons, setAvailableCoupons] = useState([])
    const [showOffers, setShowOffers] = useState(false)
    // NEW: Order loading state
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    // Fetch active coupons on mount
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch(`${API_URL}/api/coupons?where[is_active][equals]=true`)
                const data = await res.json()
                setAvailableCoupons(data.docs || [])
            } catch (err) {
                console.error("Failed to fetch coupons", err)
            }
        }
        fetchCoupons()
    }, [])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const applyCoupon = async (codeToApply) => {
        const code = codeToApply || couponCode
        if (!code) return
        setIsApplying(true)
        try {
            const res = await fetch(`${API_URL}/api/validate-coupon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, subtotal: totalPrice }),
            })
            const data = await res.json()
            if (!res.ok) {
                alert(data.error || "Invalid coupon")
                return
            }
            setDiscount(data.discount)
            setAppliedCoupon(code)
            setCouponCode("")
            setShowOffers(false)
        } catch (err) {
            console.error(err)
        } finally {
            setIsApplying(false)
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setDiscount(0)
    }

    const finalTotal = totalPrice - discount

    const handleSubmit = async e => {
        e.preventDefault()
        setIsPlacingOrder(true) // 1. Start the loader

        try {
            const items = detailedCart.map(item => ({
                product: item.id,
                product_name: item.name,
                product_image: item.images?.[0]?.url || "",
                quantity: item.quantity,
                unit_price: item.currentPrice || item.price,
                subtotal: (item.currentPrice || item.price) * item.quantity,
            }))

            const orderPayload = {
                user: user ? user.id : null,
                customer_email: user ? user.email : form.email,
                customer_phone: form.phone,
                items,
                subtotal: totalPrice,
                discount,
                coupon_code: appliedCoupon,
                total: finalTotal,
                shipping_address: {
                    full_name: form.full_name,
                    phone: form.phone,
                    line1: form.line1,
                    line2: form.line2,
                    city: form.city,
                    state: form.state,
                    postal_code: form.postal_code,
                    country: form.country,
                },
                payment_method: "cod",
                payment_status: "pending",
                order_status: "pending",
            }

            const res = await fetch(`${API_URL}/api/create-order`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderPayload),
            })

            const data = await res.json()
            if (!res.ok) {
                alert(data.error || "Order failed")
                setIsPlacingOrder(false) // 2. Stop loader on failure
                return
            }
            clearCart()
            navigate(`/order-success/${data.id || data.doc.id}`)
        } catch (err) {
            console.error(err)
            setIsPlacingOrder(false) // 3. Stop loader on error
        }
    }
    return (
        <div className="bg-white min-h-screen pb-20">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20">
                <Link to="/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-12 group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {/* LEFT: Shipping Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Checkout</h1>
                            <div className="flex justify-between items-end">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Contact & Shipping</p>
                                {!user && (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        Have an account? <Link to="/login" className="text-black underline ml-1">Login</Link>
                                    </p>
                                )}
                            </div>
                        </div>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {!user ? (
                                    <InputGroup label="Email Address" name="email" type="email" placeholder="rahul@example.com" icon={<Mail size={18} />} onChange={handleChange} required />
                                ) : (
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">Account</label>
                                        <div className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                )}
                                <InputGroup label="Full Name" name="full_name" placeholder="Rahul Swarup" icon={<User size={18} />} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Phone Number" name="phone" placeholder="+91 ..." icon={<Phone size={18} />} onChange={handleChange} required />
                                <div className="hidden md:block" />
                            </div>
                            <InputGroup label="Street Address" name="line1" placeholder="House No, Building, Street" icon={<MapPin size={18} />} onChange={handleChange} required />
                            <InputGroup label="Apartment, suite, etc. (Optional)" name="line2" placeholder="Floor, Landmark" onChange={handleChange} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputGroup label="City" name="city" placeholder="Gurugram" onChange={handleChange} required />
                                <InputGroup label="State" name="state" placeholder="Haryana" onChange={handleChange} required />
                                <InputGroup label="Postal Code" name="postal_code" placeholder="122001" onChange={handleChange} required />
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-[#F9F9F9] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-200">Order Summary</h2>
                            {/* --- ITEM PREVIEW --- */}
                            <div className="mb-8 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your Items ({detailedCart.length})</p>
                                {detailedCart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-50">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.images?.[0]?.url || '/placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[11px] font-bold text-gray-900 uppercase truncate">{item.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[11px] font-bold text-gray-900">
                                                ₹{((item.currentPrice || item.price) * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* --- COUPON INPUT & OFFERS TRIGGER --- */}
                            <div className="mb-8 space-y-4">
                                {appliedCoupon ? (
                                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-green-100 animate-in zoom-in-95">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><Tag size={14} /></div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{appliedCoupon}</p>
                                                <p className="text-[10px] text-green-600 font-bold">SAVED ₹{discount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={removeCoupon} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="ENTER CODE"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 bg-white border border-gray-200 rounded-full px-6 py-3 text-[11px] font-bold tracking-widest focus:outline-none focus:border-black transition-all"
                                            />
                                            <button onClick={() => applyCoupon()} disabled={!couponCode || isApplying} className="bg-black text-white px-6 rounded-full text-[10px] font-bold uppercase tracking-widest disabled:opacity-30">Apply</button>
                                        </div>

                                        {/* VIEW OFFERS TOGGLE */}
                                        <button
                                            onClick={() => setShowOffers(!showOffers)}
                                            className="w-full py-3 px-6 bg-white border border-gray-100 rounded-2xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-all group"
                                        >
                                            <span className="flex items-center gap-2"><Ticket size={14} className="text-gray-400 group-hover:text-black" /> View Available Offers</span>
                                            <ChevronRight size={14} className={`${showOffers ? 'rotate-90' : ''} transition-transform`} />
                                        </button>
                                    </div>
                                )}

                                {/* --- DYNAMIC OFFERS LIST --- */}
                                {showOffers && !appliedCoupon && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        {availableCoupons.map((coupon) => {
                                            const isLocked = coupon.min_order && totalPrice < coupon.min_order;
                                            const diff = coupon.min_order - totalPrice;

                                            return (
                                                <div
                                                    key={coupon.id}
                                                    className={`p-4 rounded-2xl border transition-all ${isLocked ? 'bg-gray-50/50 border-gray-100 opacity-60' : 'bg-white border-black/5 hover:border-black cursor-pointer shadow-sm'}`}
                                                    onClick={() => !isLocked && applyCoupon(coupon.code)}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-tighter uppercase ${isLocked ? 'bg-gray-200 text-gray-500' : 'bg-black text-white'}`}>
                                                            {coupon.code}
                                                        </span>
                                                        {!isLocked && <span className="text-[9px] font-bold uppercase tracking-widest text-black">Apply</span>}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-gray-900 leading-tight mb-1">
                                                        {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                                                    </p>
                                                    {isLocked ? (
                                                        <p className="text-[9px] text-gray-400 font-medium">Add ₹{diff.toLocaleString()} more to unlock this offer</p>
                                                    ) : (
                                                        <p className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Valid on this order</p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Discount ({appliedCoupon})</span>
                                        <span>- ₹{discount.toLocaleString("en-IN")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-gray-500 font-medium italic">
                                    <span>Shipping</span>
                                    <span className="text-green-600 uppercase text-[10px] font-bold tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-gray-200">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Grand Total</span>
                                    <span className="text-4xl font-serif text-gray-900 leading-none">₹{finalTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={isPlacingOrder}
                                className="w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all transform active:scale-[0.98] shadow-xl shadow-black/10 mt-10 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isPlacingOrder ? (
                                    <>
                                        PLACING ORDER <Loader2 size={14} className="animate-spin" />
                                    </>
                                ) : (
                                    "Place Order (COD)"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const InputGroup = ({ label, icon, ...props }) => (
    <div className="space-y-2 flex-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <div className="relative">
            <input {...props} className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300" />
            {icon && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>}
        </div>
    </div>
)

export default Checkout