import React, { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { Link } from "react-router-dom"
import { Package, ChevronRight, Calendar, CreditCard, ShoppingBag } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

const Orders = () => {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch(
                    `${API_URL}/api/orders?where[user][equals]=${user.id}`,
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

    /* ---------- HIGH-END SKELETON LOADER ---------- */
    if (loading) {
        return (
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 animate-pulse">
                <div className="h-12 bg-gray-100 rounded-xl w-48 mb-12" />
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-50 rounded-[2rem]" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white min-h-[85vh]">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">

                {/* --- HEADER SECTION --- */}
                <div className="mb-16">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-4">
                        Purchase History
                    </p>
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900">
                        Your Orders
                    </h1>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-24 bg-[#F9F9F9] rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                            <ShoppingBag size={24} />
                        </div>
                        <p className="text-gray-500 font-medium mb-8">You haven't placed any orders yet.</p>
                        <Link to="/products" className="px-8 py-4 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-4xl">
                        {orders.map(order => (
                            <Link
                                key={order.id}
                                to={`/orders/${order.id}`}
                                className="group block bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-black hover:shadow-xl hover:shadow-gray-500/5 transition-all"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">

                                    {/* Order Identity & Date */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-[#F9F9F9] rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest mb-1">
                                                Order #{order.order_number || order.id}
                                            </h3>
                                            <div className="flex items-center gap-4 text-gray-500 text-xs">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="flex items-center gap-1.5 uppercase font-bold tracking-tighter text-[10px]">
                                                    {order.items?.length || 0} Items
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Status */}
                                    <div className="flex items-center justify-between md:justify-end md:gap-12 border-t md:border-t-0 pt-6 md:pt-0 border-gray-50">
                                        <div className="md:text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                                            <p className="text-xl font-serif text-gray-900">
                                                ₹{order.total.toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.order_status === 'delivered'
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-[#F3F3F1] text-gray-500'
                                                    }`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Orders