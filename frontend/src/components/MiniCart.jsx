import React, { useEffect } from "react"
import { useCart } from "../context/CartContext"
import { X, Minus, Plus, Trash2, ShoppingBag, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

const BASE_URL = import.meta.env.VITE_API_URL

const MiniCart = () => {
    const {
        detailedCart = [],
        totalPrice = 0,
        drawerOpen,
        setDrawerOpen,
        updateQty,
        removeItem
    } = useCart()

    const navigate = useNavigate()

    /* ✅ Prevent body scroll when cart open */
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? "hidden" : "auto"
        return () => (document.body.style.overflow = "auto")
    }, [drawerOpen])

    return (
        <div className={`fixed inset-0 z-[100] transition-all duration-500 ${drawerOpen ? "visible" : "invisible"}`}>

            {/* Overlay */}
            <div
                onClick={() => setDrawerOpen(false)}
                className={`absolute inset-0 bg-black/40 backdrop-blur-[3px] transition-opacity duration-500 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
            />

            {/* Drawer */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="px-8 py-7 flex justify-between items-center border-b border-gray-50">
                    <div className="flex items-center gap-3">
                        <ShoppingBag size={20} className="text-gray-400" />
                        <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-gray-900">
                            Your Cart
                        </h2>
                        <span className="bg-[#F3F3F1] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {detailedCart.length}
                        </span>
                    </div>

                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 hover:bg-[#F9F9F9] rounded-full transition-colors group"
                    >
                        <X size={20} className="text-gray-400 group-hover:text-black" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 px-8 py-6 space-y-10 overflow-y-auto custom-scrollbar">

                    {detailedCart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-[#F3F3F1] rounded-full flex items-center justify-center text-gray-300">
                                <ShoppingBag size={24} />
                            </div>
                            <p className="text-gray-500 text-sm tracking-wide">
                                Your cart is currently empty.
                            </p>
                        </div>
                    ) : (
                        detailedCart.map(item => {
                            /* ✅ Unique key for React using both ID and Variant ID */
                            const itemKey = `${item.id}-${item.variantId || 'base'}`

                            /* ✅ Safe image handling */
                            let img = item.images?.[0]?.url || item.imageSnapshot || null
                            if (img && !img.startsWith("http")) {
                                img = BASE_URL + img
                            }
                            if (!img) {
                                img = "https://via.placeholder.com/300x300?text=No+Image"
                            }

                            return (
                                <div key={itemKey} className="flex gap-6 group">

                                    {/* Image */}
                                    <div className="w-24 h-24 bg-[#F3F3F1] rounded-2xl overflow-hidden flex-shrink-0">
                                        <img
                                            src={img}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between py-1">

                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 uppercase text-[11px] tracking-widest">
                                                        {item.name}
                                                    </h3>

                                                    {/* ✅ VARIATION LABEL (Injected) */}
                                                    {item.variantLabel && (
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                            {item.variantLabel}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id, item.variantId)}
                                                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <p className="text-sm font-medium text-gray-500 italic">
                                                ₹{item.currentPrice.toLocaleString("en-IN")}
                                            </p>

                                            {/* Price change indicator */}
                                            {item.priceChanged && (
                                                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-tighter">
                                                    <AlertCircle size={12} />
                                                    Price Updated
                                                </div>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center bg-[#F9F9F9] rounded-full p-1 border border-gray-100 shadow-sm">

                                                <button
                                                    onClick={() => updateQty(item.id, item.variantId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all disabled:opacity-30"
                                                >
                                                    <Minus size={12} />
                                                </button>

                                                <span className="text-xs font-bold w-8 text-center">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() => updateQty(item.id, item.variantId, item.quantity + 1)}
                                                    className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all"
                                                >
                                                    <Plus size={12} />
                                                </button>

                                            </div>

                                            <p className="text-[13px] font-bold text-gray-900">
                                                ₹{(item.currentPrice * item.quantity).toLocaleString("en-IN")}
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 bg-[#F9F9F9] border-t border-gray-100">

                    <div className="flex justify-between items-end mb-8">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                Estimated Total
                            </p>
                            <p className="text-[11px] text-gray-400 leading-tight">
                                Tax and shipping calculated<br />at checkout.
                            </p>
                        </div>

                        <p className="text-3xl font-serif text-gray-900 leading-none">
                            ₹{totalPrice.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setDrawerOpen(false)
                            navigate("/checkout")
                        }}
                        className="w-full bg-black text-white py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-900 transition-colors"
                    >
                        Proceed to Checkout
                    </button>

                </div>
            </div>
        </div>
    )
}

export default MiniCart