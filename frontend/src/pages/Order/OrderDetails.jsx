import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
    ChevronLeft, Package, MapPin, CreditCard,
    Calendar, Box, Truck, CheckCircle2, Loader2, ArrowRight, ExternalLink
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const OrderDetails = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [settings, setSettings] = useState(null) // Added settings state
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch Order and Business Settings in parallel
                const [orderRes, settingsRes] = await Promise.all([
                    fetch(`${API_URL}/api/orders/${id}`, { credentials: "include" }),
                    fetch(`${API_URL}/api/globals/business-settings`, { credentials: "include" })
                ]);

                const orderData = await orderRes.json()
                const settingsData = await settingsRes.json()

                setOrder(orderData)
                setSettings(settingsData)
            } catch (err) {
                console.error("Failed to fetch order details or settings", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    // Calculation for Reverse GST based on dynamic settings
    const calculateTaxBreakdown = (total) => {
        const gstPercentage = settings?.gstPercentage || 18;
        const base = total / (1 + (gstPercentage / 100));
        const gst = total - base;
        return { base, gst };
    }

    if (loading) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading Order Details</p>
        </div>
    )

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <h2 className="text-4xl font-serif">Order not found.</h2>
            <Link to="/orders" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all">
                <ChevronLeft size={14} /> Return to History
            </Link>
        </div>
    )

    const { base, gst } = calculateTaxBreakdown(order.total);

    return (
        <div className="bg-[#F9F9F7] min-h-screen pb-32">
            {/* --- CINEMATIC HEADER --- */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
                    <Link to="/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all mb-12 group">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Purchase History
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-4 py-1.5 rounded-full bg-black text-white text-[9px] font-bold uppercase tracking-widest">
                                    {order.order_status}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-none">
                                Order <span className="italic text-gray-300">#{order.order_number}</span>
                            </h1>
                        </div>

                        {order.tracking?.tracking_number && (
                            <a
                                href={order.tracking.tracking_url || "#"}
                                target="_blank"
                                className="flex items-center gap-3 bg-white border border-gray-200 px-8 py-4 rounded-2xl hover:border-black transition-all group"
                            >
                                <div className="text-left">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Tracking Number</p>
                                    <p className="text-sm font-bold text-black uppercase">{order.tracking.tracking_number}</p>
                                </div>
                                <ExternalLink size={16} className="text-gray-300 group-hover:text-black transition-colors" />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* --- LEFT: TRACKING & ITEMS --- */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Status Stepper */}
                        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-50 shadow-sm overflow-x-auto">
                            <div className="flex justify-between items-center min-w-[600px] relative">
                                {/* Connecting Line */}
                                <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-100 -z-0" />

                                <StatusStep label="Confirmed" icon={<CheckCircle2 size={20} />} active={['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.order_status)} />
                                <StatusStep label="Processing" icon={<Box size={20} />} active={['processing', 'shipped', 'out_for_delivery', 'delivered'].includes(order.order_status)} />
                                <StatusStep label="Shipped" icon={<Truck size={20} />} active={['shipped', 'out_for_delivery', 'delivered'].includes(order.order_status)} />
                                <StatusStep label="Delivered" icon={<Package size={20} />} active={order.order_status === 'delivered'} />
                            </div>
                        </div>

                        {/* Items Section */}
                        <section className="bg-white p-10 md:p-12 rounded-[3rem] border border-gray-50 shadow-sm">
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-10">Shipment Content</h2>
                            <div className="divide-y divide-gray-50">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-8 py-8 first:pt-0 last:pb-0 group">
                                        <div className="w-24 h-24 bg-[#F9F9F7] rounded-[2rem] overflow-hidden flex-shrink-0 border border-transparent group-hover:border-black/5 transition-all">
                                            <img
                                                src={item.product_image}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <h3 className="font-bold text-gray-900 uppercase text-[12px] tracking-[0.1em]">{item.product_name}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xl font-serif text-gray-900">
                                                ₹{item.subtotal.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* --- RIGHT: BILLING & DELIVERY --- */}
                    <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-12">

                        {/* Financial Summary */}
                        <div className="bg-black text-white rounded-[3rem] p-10 md:p-12 shadow-2xl">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-10">Financial Summary</h3>

                            <div className="space-y-5 mb-10">
                                <SummaryRow label="Items Subtotal (Base)" value={`₹${base.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} />
                                <SummaryRow label={`GST (${settings?.gstPercentage || 18}%)`} value={`₹${gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} />
                                <SummaryRow label="Shipping" value="FREE" isFree />
                                {order.discount > 0 && <SummaryRow label="Discount" value={`- ₹${order.discount.toLocaleString()}`} isDiscount />}
                            </div>

                            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Total Paid</span>
                                    <span className="text-4xl font-serif leading-none">₹{order.total.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-bold uppercase tracking-widest bg-white/10 px-2 py-1 rounded text-white/60">
                                        INR
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Address & Logistics */}
                        <div className="bg-white rounded-[3rem] p-10 md:p-12 border border-gray-50 shadow-sm space-y-12">
                            <InfoSection icon={<MapPin size={18} />} title="Delivery Address">
                                <p className="text-sm text-gray-900 font-bold mb-1">
                                    {order.shipping_address.full_name}
                                </p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {order.shipping_address.line1}<br />
                                    {order.shipping_address.line2 && `${order.shipping_address.line2}, `}
                                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                                </p>
                            </InfoSection>

                            <InfoSection icon={<CreditCard size={18} />} title="Payment Details">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-900">
                                            {order.payment_method?.toUpperCase()}
                                        </p>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-tighter">Status: {order.payment_status}</p>
                                    </div>
                                    {order.payment_status === 'paid' && <CheckCircle2 size={20} className="text-green-500" />}
                                </div>
                            </InfoSection>
                        </div>

                    </div>
                </div>
            </div>

            {/* Subtle brand watermark */}
            <div className="py-20 text-center opacity-[0.03] select-none pointer-events-none">
                <h2 className="text-[12vw] font-black leading-none uppercase tracking-tighter">BoltLess</h2>
            </div>
        </div>
    )
}

/* --- REFINED HELPER COMPONENTS --- */

const SummaryRow = ({ label, value, isFree, isDiscount }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-white/50 font-medium tracking-tight">{label}</span>
        <span className={`font-bold ${isFree ? "text-green-400 text-[10px] tracking-widest" : isDiscount ? "text-green-400" : "text-white"}`}>
            {value}
        </span>
    </div>
)

const InfoSection = ({ icon, title, children }) => (
    <div className="space-y-6">
        <div className="flex items-center gap-4 text-gray-400">
            <div className="w-10 h-10 rounded-2xl bg-[#F9F9F7] border border-gray-50 flex items-center justify-center text-gray-900">{icon}</div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-900">{title}</h4>
        </div>
        <div className="pl-14">{children}</div>
    </div>
)

const StatusStep = ({ icon, label, active }) => (
    <div className="flex flex-col items-center gap-4 relative z-10 flex-1">
        <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 ${active ? 'bg-black text-white shadow-xl scale-110' : 'bg-white border border-gray-100 text-gray-200'}`}>
            {icon}
        </div>
        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] ${active ? 'text-black' : 'text-gray-300'}`}>{label}</p>
    </div>
)

export default OrderDetails