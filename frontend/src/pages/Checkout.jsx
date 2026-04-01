import React, { useEffect, useState } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import {
    MapPin, Phone, User, Loader2, ChevronLeft,
    Tag, X, Ticket, ChevronRight, Mail,
    Home, Briefcase, Plus, CreditCard, Banknote, Sparkles
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

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
        email: user?.email || "",
    })

    // --- PAYMENT & ADDRESS STATES ---
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("cod") // Default to COD

    // Coupon & Offers State
    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [discount, setDiscount] = useState(0)
    const [isApplying, setIsApplying] = useState(false)
    const [availableCoupons, setAvailableCoupons] = useState([])
    const [showOffers, setShowOffers] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    // Helper to dynamically load Razorpay script
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }

    // Auto-select default address on load
    useEffect(() => {
        if (user?.addresses?.length > 0) {
            const defaultIdx = user.addresses.findIndex(a => a.is_default)
            const indexToSelect = defaultIdx !== -1 ? defaultIdx : 0
            handleAddressSelect(indexToSelect)
        }
    }, [user])

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

    const handleAddressSelect = (index) => {
        const addr = user.addresses[index]
        setSelectedAddressIndex(index)
        setForm({
            full_name: addr.full_name,
            phone: addr.phone,
            line1: addr.line1,
            line2: addr.line2 || "",
            city: addr.city,
            state: addr.state,
            postal_code: addr.postal_code,
            country: addr.country || "India",
            email: user.email
        })
    }

    const handleNewAddress = () => {
        setSelectedAddressIndex('new')
        setForm({
            full_name: "",
            phone: "",
            line1: "",
            line2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "India",
            email: user?.email || "",
        })
    }

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
        setIsPlacingOrder(true)

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
                customer_email: form.email,
                customer_phone: form.phone,
                items,
                subtotal: totalPrice,
                discount,
                coupon_code: appliedCoupon,
                total: finalTotal,
                shipping_address: { ...form },
                payment_method: paymentMethod,
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
                setIsPlacingOrder(false)
                return
            }

            const orderDoc = data.doc || data;

            if (paymentMethod === "razorpay") {
                const isLoaded = await loadRazorpayScript()
                if (!isLoaded) {
                    alert("Razorpay SDK failed to load.")
                    setIsPlacingOrder(false)
                    return
                }

                const options = {
                    key: RAZORPAY_KEY_ID,
                    amount: finalTotal * 100,
                    currency: "INR",
                    name: "BOLTLESS",
                    description: `Order #${orderDoc.order_number}`,
                    image: "/logo.png",
                    order_id: orderDoc.payment_details?.razorpay_order_id,
                    handler: async (response) => {
                        clearCart()
                        navigate(`/order-success/${orderDoc.id}`)
                    },
                    prefill: {
                        name: form.full_name,
                        email: form.email,
                        contact: form.phone
                    },
                    theme: { color: "#000000" }
                }

                const rzp = new window.Razorpay(options)
                rzp.open()
                setIsPlacingOrder(false)
            } else {
                clearCart()
                navigate(`/order-success/${orderDoc.id}`)
            }
        } catch (err) {
            console.error(err)
            setIsPlacingOrder(false)
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
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Checkout</h1>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Shipping & Payment</p>
                        </div>

                        {/* --- SAVED ADDRESSES QUICK SELECT --- */}
                        {user && user.addresses?.length > 0 && (
                            <section className="space-y-6">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Quick Select Address</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.addresses.map((addr, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleAddressSelect(idx)}
                                            className={`cursor-pointer p-6 rounded-[2rem] border transition-all ${selectedAddressIndex === idx ? 'border-black bg-black text-white shadow-xl' : 'border-gray-100 bg-[#F9F9F9] hover:border-gray-300'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                {addr.label?.toLowerCase().includes('home') ? <Home size={14} /> : addr.label?.toLowerCase().includes('office') ? <Briefcase size={14} /> : <MapPin size={14} />}
                                                <span className="text-[9px] font-black uppercase tracking-widest">{addr.label || 'Saved Address'}</span>
                                            </div>
                                            <p className={`text-xs font-bold truncate ${selectedAddressIndex === idx ? 'text-white' : 'text-black'}`}>{addr.full_name}</p>
                                            <p className={`text-[10px] mt-1 line-clamp-1 ${selectedAddressIndex === idx ? 'text-gray-400' : 'text-gray-500'}`}>{addr.line1}, {addr.city}</p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={handleNewAddress}
                                        className={`cursor-pointer p-6 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${selectedAddressIndex === 'new' ? 'border-black bg-white' : 'border-gray-100 text-gray-300 hover:border-gray-300'}`}
                                    >
                                        <Plus size={20} />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">Use New Address</span>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* --- PAYMENT METHOD SELECTION --- */}
                        <section className="space-y-6 pt-8 border-t border-gray-50">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Payment Method</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PaymentCard
                                    active={paymentMethod === 'razorpay'}
                                    onClick={() => setPaymentMethod('razorpay')}
                                    icon={<CreditCard size={18} />}
                                    title="Online Payment"
                                    desc="UPI, Cards, Netbanking"
                                />
                                <PaymentCard
                                    active={paymentMethod === 'cod'}
                                    onClick={() => setPaymentMethod('cod')}
                                    icon={<Banknote size={18} />}
                                    title="Cash on Delivery"
                                    desc="Pay when you receive"
                                />
                            </div>
                        </section>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 pt-8 border-t border-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {!user ? (
                                    <InputGroup label="Email Address" name="email" type="email" value={form.email} placeholder="rahul@example.com" icon={<Mail size={18} />} onChange={handleChange} required />
                                ) : (
                                    <div className="space-y-2 flex-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">Account</label>
                                        <div className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-bold text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                )}
                                <InputGroup label="Full Name" name="full_name" value={form.full_name} placeholder="Rahul Swarup" icon={<User size={18} />} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Phone Number" name="phone" value={form.phone} placeholder="+91 ..." icon={<Phone size={18} />} onChange={handleChange} required />
                                <div className="hidden md:block" />
                            </div>
                            <InputGroup label="Street Address" name="line1" value={form.line1} placeholder="House No, Building, Street" icon={<MapPin size={18} />} onChange={handleChange} required />
                            <InputGroup label="Apartment, suite, etc. (Optional)" name="line2" value={form.line2} placeholder="Floor, Landmark" onChange={handleChange} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputGroup label="City" name="city" value={form.city} placeholder="City" onChange={handleChange} required />
                                <InputGroup label="State" name="state" value={form.state} placeholder="State" onChange={handleChange} required />
                                <InputGroup label="Postal Code" name="postal_code" value={form.postal_code} placeholder="Pincode" onChange={handleChange} required />
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-[#F9F9F9] rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-200">Order Summary</h2>

                            <div className="mb-8 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Your Items ({detailedCart.length})</p>
                                {detailedCart.map((item) => (
                                    <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-50">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                            <img src={item.images?.[0]?.url || '/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
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
                                        <button onClick={() => setShowOffers(!showOffers)} className="w-full py-3 px-6 bg-white border border-gray-100 rounded-2xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-all group">
                                            <span className="flex items-center gap-2"><Ticket size={14} className="text-gray-400 group-hover:text-black" /> View Available Offers</span>
                                            <ChevronRight size={14} className={`${showOffers ? 'rotate-90' : ''} transition-transform`} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Items Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    <span>GST & Shipping</span>
                                    <span className="text-green-600">INCLUDED</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-bold">
                                        <span>Discount ({appliedCoupon})</span>
                                        <span>- ₹{discount.toLocaleString("en-IN")}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-6 border-t border-gray-200">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 leading-none">Grand Total</span>
                                        <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">Incl. all taxes</span>
                                    </div>
                                    <span className="text-4xl font-serif text-gray-900 leading-none">₹{finalTotal.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button form="checkout-form" type="submit" disabled={isPlacingOrder} className="w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 mt-10 flex items-center justify-center gap-3 disabled:opacity-50">
                                {isPlacingOrder ? <>PROCESSING <Loader2 size={14} className="animate-spin" /></> : paymentMethod === 'razorpay' ? "Proceed to Payment" : "Place Order (COD)"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PaymentCard = ({ active, onClick, icon, title, desc, comingSoon }) => (
    <div
        onClick={!comingSoon ? onClick : undefined}
        className={`relative p-6 rounded-[2rem] border transition-all flex items-center gap-5 ${comingSoon ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-100' : 'cursor-pointer'} ${active && !comingSoon ? 'border-black bg-white shadow-xl ring-1 ring-black' : 'border-gray-100 bg-[#F9F9F9] hover:border-gray-200'}`}
    >
        {comingSoon && (
            <div className="absolute top-4 right-4 bg-gray-900 text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles size={8} /> Coming Soon
            </div>
        )}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${active && !comingSoon ? 'bg-black text-white' : 'bg-white text-gray-400'}`}>{icon}</div>
        <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-black">{title}</p>
            <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
        </div>
    </div>
)

const InputGroup = ({ label, icon, ...props }) => (
    <div className="space-y-2 flex-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <div className="relative">
            <input {...props} className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300 text-black" />
            {icon && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>}
        </div>
    </div>
)

export default Checkout