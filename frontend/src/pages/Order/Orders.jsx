import React, { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { Package, ChevronRight, Calendar, ShoppingBag, Loader2, ArrowRight } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const Orders = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch(
                    `${API_URL}/api/orders?where[user][equals]=${user.id}&sort=-createdAt`,
                    { credentials: "include" }
                )
                const data = await res.json()
                setOrders(data.docs || [])
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchOrders()
    }, [user])

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            case 'shipped': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Retrieving History</p>
            </div>
        )
    }

    return (
        <div className="bg-[#F9F9F7] min-h-screen">
            {/* --- HEADER BLOCK --- */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">Account Center</p>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <h1 className="text-6xl md:text-8xl font-serif text-gray-900 leading-tight">
                            Past <span className="italic text-gray-300">Orders</span>
                        </h1>
                        <div className="flex items-center gap-4 bg-[#F9F9F7] px-8 py-4 rounded-2xl border border-gray-100">
                            <div className="text-right">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Lifetime Orders</p>
                                <p className="text-xl font-serif">{orders.length}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-200 mx-2" />
                            <Package className="text-gray-300" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
                {orders.length === 0 ? (
                    <div className="max-w-xl mx-auto text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-[#F9F9F7] rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h2 className="text-3xl font-serif mb-4 text-gray-900">No orders found.</h2>
                        <p className="text-gray-500 mb-10 max-w-xs mx-auto leading-relaxed text-sm">It looks like you haven't brought BoltLess home yet. Start your journey here.</p>
                        <Link to="/products" className="inline-flex items-center gap-3 px-12 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10 group">
                            Explore Shop <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    /* --- GRID LAYOUT TO FILL SPACE --- */
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {orders.map(order => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="group block bg-white border border-transparent p-8 md:p-10 rounded-[3rem] hover:border-black hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
                            >
                                <div className="flex flex-col gap-8">

                                    {/* Top Row: Meta Info */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusStyles(order.order_status)}`}>
                                                {order.order_status}
                                            </span>
                                            <h3 className="font-bold text-gray-900 uppercase text-[12px] tracking-[0.15em] mt-5 mb-1 group-hover:underline underline-offset-8">
                                                Order #{order.order_number}
                                            </h3>
                                            <p className="text-gray-400 text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest">
                                                <Calendar size={12} className="text-gray-300" /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-300 mb-1">Final Amount</p>
                                            <p className="text-3xl font-serif text-gray-900">
                                                ₹{order.total.toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle Row: Item Previews */}
                                    <div className="flex items-center gap-4 py-6 border-y border-gray-50">
                                        <div className="flex -space-x-4 overflow-hidden">
                                            {order.items?.slice(0, 3).map((item, idx) => (
                                                <div key={idx} className="w-16 h-16 rounded-2xl border-4 border-white bg-[#F9F9F7] overflow-hidden shadow-sm">
                                                    <img
                                                        src={item.product_image || '/api/placeholder/100/100'}
                                                        className="w-full h-full object-cover"
                                                        alt="product"
                                                    />
                                                </div>
                                            ))}
                                            {order.items?.length > 3 && (
                                                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-black flex items-center justify-center text-white text-[10px] font-bold tracking-tighter">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Contents</p>
                                            <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">
                                                {order.items?.map(i => i.product_name).join(', ')}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>

                                    {/* Bottom Row: CTA / Footer */}
                                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Click to view full details and tracking</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Subtle brand watermark */}
            <div className="pb-20 text-center opacity-[0.03] select-none pointer-events-none">
                <h2 className="text-[15vw] font-black leading-none uppercase tracking-tighter">BoltLess</h2>
            </div>
        </div>
    )
}

export default Orders