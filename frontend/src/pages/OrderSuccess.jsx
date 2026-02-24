import React from "react"
import { useParams, Link } from "react-router-dom"
import { CheckCircle, ShoppingBag, ArrowRight, Package, Calendar, Mail, UserPlus } from "lucide-react"
import { useAuth } from "../context/AuthContext" // 1. Import useAuth

const OrderSuccess = () => {
    const { id } = useParams()
    const { user } = useAuth() // 2. Get user state

    const today = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <div className="bg-white min-h-[85vh] flex flex-col items-center justify-center px-6 py-20">
            {/* --- SUCCESS ICON & HEADER --- */}
            <div className="text-center mb-12 space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#F3F3F1] text-black rounded-full mb-4">
                    <CheckCircle size={40} strokeWidth={1.5} />
                </div>
                <h1 className="text-5xl md:text-7xl font-serif text-gray-900 leading-tight">
                    Thank you. <br />
                    Your order is placed.
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.25em]">
                    Order #{id}
                </p>
            </div>

            {/* --- RECEIPT CARD --- */}
            <div className="w-full max-w-[500px] bg-[#F9F9F9] rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm mb-8">
                <div className="space-y-8">
                    <div className="flex items-start gap-5">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Package size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</h3>
                            <p className="text-sm font-bold text-gray-900">Processing</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Date</h3>
                            <p className="text-sm font-bold text-gray-900">{today}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Confirmation</h3>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">
                                We've sent a confirmation email to your inbox. We will reach out for verification shortly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- GUEST ACCOUNT NUDGE --- */}
            {!user && (
                <div className="w-full max-w-[500px] mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="bg-black/5 rounded-3xl p-6 border border-dashed border-gray-200">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 mb-2">Want to track this order?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Create a <span className="text-black font-bold">BOLTLESS</span> account in seconds to save your shipping details and view your full order history.
                        </p>
                    </div>
                </div>
            )}

            {/* --- ACTION BUTTONS --- */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[500px]">
                <Link
                    to="/products"
                    className="flex-1 bg-black text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-gray-800 transition-all transform active:scale-[0.98]"
                >
                    Continue Shopping
                    <ShoppingBag size={14} />
                </Link>

                {user ? (
                    <Link
                        to="/account"
                        className="flex-1 bg-white border border-gray-200 text-black py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:border-black transition-all transform active:scale-[0.98]"
                    >
                        View Account
                        <ArrowRight size={14} />
                    </Link>
                ) : (
                    <Link
                        to="/signup"
                        className="flex-1 bg-[#F3F3F1] text-black py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all transform active:scale-[0.98]"
                    >
                        Create Account
                        <UserPlus size={14} />
                    </Link>
                )}
            </div>
        </div>
    )
}

export default OrderSuccess