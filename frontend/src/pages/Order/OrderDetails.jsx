import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    ChevronLeft, Package, MapPin, CreditCard,
    Calendar, Box, Truck, CheckCircle2
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const OrderDetails = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const res = await fetch(`${API_URL}/api/orders/${id}`, {
                    credentials: "include",
                })
                const data = await res.json()
                setOrder(data)
            } catch (err) {
                console.error("Failed to fetch order details", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    /* ---------- Skeleton Loader ---------- */
    if (loading) return (
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 animate-pulse">
            <div className="h-6 w-32 bg-gray-100 rounded mb-10" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-6">
                    <div className="h-16 bg-gray-100 rounded-xl w-1/2" />
                    <div className="h-64 bg-gray-50 rounded-[2.5rem]" />
                </div>
                <div className="lg:col-span-4 h-96 bg-gray-50 rounded-[2.5rem]" />
            </div>
        </div>
    )

    if (!order) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-500 font-serif text-xl">Order not found.</p>
            <Link to="/orders" className="text-xs font-bold uppercase tracking-widest underline underline-offset-8">
                Back to History
            </Link>
        </div>
    )

    return (
        <div className="bg-white min-h-screen">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20">

                {/* --- NAVIGATION & HEADER --- */}
                <Link to="/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-10 group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Purchase History
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">Receipt Details</p>
                        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 leading-none">
                            Order #{order.order_number || order.id}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 bg-[#F3F3F1] px-6 py-3 rounded-full">
                        <div className={`w-2 h-2 rounded-full ${order.order_status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                            {order.order_status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* --- LEFT: ITEMS LIST --- */}
                    <div className="lg:col-span-8 space-y-12">
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 px-2">Shipment Content</h2>
                            <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="group flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[2rem] border border-gray-50 bg-white hover:border-black transition-all">
                                        <div className="w-24 h-24 bg-[#F9F9F9] rounded-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-gray-900 uppercase text-[12px] tracking-widest">{item.product_name}</h3>
                                            <p className="text-sm text-gray-500 font-medium italic">Qty: {item.quantity}</p>
                                        </div>

                                        <div className="sm:text-right">
                                            <p className="text-lg font-serif text-gray-900">
                                                ₹{item.subtotal.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* --- ORDER TIMELINE SNIPPET --- */}
                        <div className="p-10 bg-[#F9F9F9] rounded-[3rem] border border-gray-100 flex flex-col md:flex-row gap-10">
                            <TimelineStep icon={<Calendar size={20} />} label="Ordered" date={new Date(order.createdAt).toLocaleDateString()} active />
                            <TimelineStep icon={<Box size={20} />} label="Processed" date="Next Day" active />
                            <TimelineStep icon={<Truck size={20} />} label="Shipped" date="Standard Express" />
                        </div>
                    </div>

                    {/* --- RIGHT: STICKY SUMMARY SIDEBAR --- */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">

                        {/* Summary Pill */}
                        <div className="bg-black text-white rounded-[2.5rem] p-10 shadow-xl">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/50 mb-10">Financial Summary</h3>

                            <div className="space-y-4 mb-10">
                                <SummaryRow label="Subtotal" value={`₹${order.subtotal.toLocaleString("en-IN")}`} />
                                <SummaryRow label="Shipping" value="₹0.00" isFree />
                                <SummaryRow label="Tax" value={`₹${(order.tax || 0).toLocaleString("en-IN")}`} />
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Total</span>
                                <span className="text-3xl font-serif leading-none">₹{order.total.toLocaleString("en-IN")}</span>
                            </div>
                        </div>

                        {/* Details Pill */}
                        <div className="bg-[#F9F9F9] rounded-[2.5rem] p-10 border border-gray-100 space-y-10">
                            <InfoSection icon={<MapPin size={18} />} title="Delivery Address">
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {order.shipping_address.full_name}<br />
                                    {order.shipping_address.line1}<br />
                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                </p>
                            </InfoSection>

                            <InfoSection icon={<CreditCard size={18} />} title="Payment Method">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Status: {order.payment_status}</p>
                            </InfoSection>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

/* --- HELPER COMPONENTS --- */

const SummaryRow = ({ label, value, isFree }) => (
    <div className="flex justify-between text-sm">
        <span className="text-white/60 font-medium">{label}</span>
        <span className={isFree ? "text-green-400 font-bold uppercase text-[10px] tracking-widest" : "font-bold"}>{value}</span>
    </div>
)

const InfoSection = ({ icon, title, children }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center">{icon}</div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">{title}</h4>
        </div>
        <div className="pl-11">{children}</div>
    </div>
)

const TimelineStep = ({ icon, label, date, active }) => (
    <div className={`flex items-center gap-4 ${active ? 'text-gray-900' : 'text-gray-300'}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-white shadow-sm text-black' : 'bg-gray-100 text-gray-300'}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">{label}</p>
            <p className="text-[11px] font-medium opacity-60">{date || 'Pending'}</p>
        </div>
    </div>
)

export default OrderDetails