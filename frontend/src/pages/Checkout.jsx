import React, { useState } from "react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useNavigate, Link } from "react-router-dom"
import { MapPin, Phone, User, ChevronLeft, ShieldCheck, Truck } from "lucide-react"

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
    })

    if (!user) {
        navigate("/login")
        return null
    }

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()

        const items = detailedCart.map(item => ({
            product: item.id,
            product_name: item.name,
            product_image: item.images?.[0]?.url || "",
            quantity: item.quantity,
            unit_price: item.currentPrice || item.price,
            subtotal: (item.currentPrice || item.price) * item.quantity,
        }))

        const subtotal = items.reduce((s, i) => s + i.subtotal, 0)

        const orderPayload = {
            user: user.id,
            customer_email: user.email,
            customer_phone: form.phone,
            items,
            subtotal,
            shipping_cost: 0,
            tax: 0,
            discount: 0,
            total: subtotal,
            shipping_address: form,
            payment_method: "cod",
            payment_status: "pending",
            order_status: "pending",
        }

        const res = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderPayload),
        })

        if (!res.ok) {
            alert("Order failed")
            return
        }

        const data = await res.json()
        const orderId = data.doc?.id

        if (!orderId) {
            alert("Order created but ID missing")
            return
        }

        clearCart()

        navigate(`/order-success/${orderId}`)
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20">

                {/* Back Link */}
                <Link to="/products" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-12 group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Shopping
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* LEFT: Shipping Form */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Checkout</h1>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">Shipping Information</p>
                        </div>

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputGroup label="Full Name" name="full_name" placeholder="Rahul Swarup" icon={<User size={18} />} onChange={handleChange} required />
                                <InputGroup label="Phone Number" name="phone" placeholder="+91 ..." icon={<Phone size={18} />} onChange={handleChange} required />
                            </div>

                            <InputGroup label="Street Address" name="line1" placeholder="House No, Building, Street" icon={<MapPin size={18} />} onChange={handleChange} required />
                            <InputGroup label="Apartment, suite, etc. (Optional)" name="line2" placeholder="Floor, Landmark" onChange={handleChange} />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputGroup label="City" name="city" placeholder="Gurugram" onChange={handleChange} required />
                                <InputGroup label="State" name="state" placeholder="Haryana" onChange={handleChange} required />
                                <InputGroup label="Postal Code" name="postal_code" placeholder="122001" onChange={handleChange} required />
                            </div>
                        </form>

                        <div className="grid grid-cols-2 gap-6 py-10 border-t border-gray-100">
                            <div className="flex items-center gap-4 text-gray-500">
                                <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center"><Truck size={20} /></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Free Express Shipping</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500">
                                <div className="w-10 h-10 rounded-full bg-[#F9F9F9] flex items-center justify-center"><ShieldCheck size={20} /></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Payment (COD)</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                        <div className="bg-[#F9F9F9] rounded-[2.5rem] p-8 md:p-10 border border-gray-100">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 mb-8 pb-4 border-b border-gray-200">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {detailedCart.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                            <img
                                                src={item.images?.[0]?.url?.startsWith("http") ? item.images[0].url : `${API_URL}${item.images?.[0]?.url}`}
                                                className="w-full h-full object-cover"
                                                alt={item.name}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-900">{item.name}</h4>
                                                <p className="text-[11px] font-bold">₹{(item.currentPrice * item.quantity).toLocaleString("en-IN")}</p>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-200">
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-green-600 uppercase text-[10px] font-bold tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Grand Total</span>
                                    <span className="text-3xl font-serif text-gray-900 leading-none">₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                className="w-full bg-black text-white py-5 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-all transform active:scale-[0.98] shadow-xl shadow-black/5 mt-10"
                            >
                                Place Order (COD)
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

/* Helper Component */
const InputGroup = ({ label, icon, ...props }) => (
    <div className="space-y-2 flex-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900 ml-5">{label}</label>
        <div className="relative">
            <input
                {...props}
                className="w-full px-6 py-5 rounded-2xl border border-gray-100 bg-[#F9F9F9] text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
            />
            {icon && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>}
        </div>
    </div>
)

export default Checkout