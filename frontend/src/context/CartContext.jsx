import { createContext, useContext, useEffect, useState } from "react"
import { getAllProducts } from "../api/products"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    /* ---------- 1. Lazy Load Thin Cart ---------- */
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart")
        return saved ? JSON.parse(saved) : []
    })

    /* ---------- 2. FIXED: Lazy Load Detailed Cart ---------- */
    // This uses the "Snapshots" saved during addToCart to populate the UI instantly on refresh
    const [detailedCart, setDetailedCart] = useState(() => {
        const saved = localStorage.getItem("cart")
        if (!saved) return []
        try {
            const parsed = JSON.parse(saved)
            return parsed.map(item => ({
                id: item.productId,
                name: item.nameSnapshot,
                variantLabel: item.variantNameSnapshot,
                quantity: item.quantity,
                currentPrice: item.priceSnapshot,
                snapshotPrice: item.priceSnapshot,
                variantId: item.variantId,
                images: item.imageSnapshot ? [{ url: item.imageSnapshot }] : [],
                priceChanged: false
            }))
        } catch (e) {
            return []
        }
    })

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [coupon, setCoupon] = useState(null)

    /* ---------- Persist ---------- */
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    /* ---------- Hydrate with server data ---------- */
    useEffect(() => {
        async function hydrate() {
            if (!cart.length) {
                setDetailedCart([])
                return
            }

            try {
                const products = await getAllProducts()

                const hydrated = cart.map(item => {
                    const product = products.find(p => p.id === item.productId)
                    if (!product) return null

                    let currentPrice = product.price
                    let variantLabel = null

                    if (item.variantId && product.variants) {
                        const variant = product.variants.find(v => v.id === item.variantId)
                        if (variant) {
                            currentPrice = variant.price
                            variantLabel = variant.variant_name
                        }
                    }

                    return {
                        ...product,
                        quantity: item.quantity,
                        variantId: item.variantId,
                        variantLabel: variantLabel || item.variantNameSnapshot,

                        priceChanged: currentPrice !== item.priceSnapshot,
                        currentPrice,
                        snapshotPrice: item.priceSnapshot
                    }
                }).filter(Boolean)

                setDetailedCart(hydrated)
            } catch (error) {
                console.error("Cart hydration failed:", error)
            }
        }

        hydrate()
    }, [cart.length]) // Re-hydrate only when items are added/removed

    /* ---------- ADD ---------- */
    const addToCart = (product, qty = 1) => {
        const vId = product.variant_id || null
        const pId = product.id

        // 1. Update Cart (Persistence)
        setCart(prev => {
            const existing = prev.find(i => i.productId === pId && i.variantId === vId)
            if (existing) {
                return prev.map(i => (i.productId === pId && i.variantId === vId)
                    ? { ...i, quantity: i.quantity + qty } : i
                )
            }
            return [...prev, {
                productId: pId,
                variantId: vId,
                variantNameSnapshot: product.variant_name || null,
                quantity: qty,
                priceSnapshot: product.price,
                nameSnapshot: product.name,
                imageSnapshot: product.images?.[0]?.url || null,
                addedAt: Date.now()
            }]
        })

        // 2. OPTIMISTIC UI: Update Detailed Cart immediately for zero lag
        setDetailedCart(prev => {
            const existing = prev.find(i => (i.id === pId || i.productId === pId) && i.variantId === vId)
            if (existing) {
                return prev.map(i => ((i.id === pId || i.productId === pId) && i.variantId === vId)
                    ? { ...i, quantity: i.quantity + qty } : i
                )
            }
            return [...prev, {
                ...product,
                quantity: qty,
                variantId: vId,
                variantLabel: product.variant_name,
                currentPrice: product.price,
                snapshotPrice: product.price,
                priceChanged: false
            }]
        })

        setDrawerOpen(true)
    }

    /* ---------- UPDATE ---------- */
    const updateQty = (productId, variantId, qty) => {
        if (qty <= 0) return removeItem(productId, variantId)

        const updateLogic = (items) => items.map(i =>
            ((i.productId || i.id) === productId && i.variantId === variantId)
                ? { ...i, quantity: qty } : i
        )

        setCart(prev => updateLogic(prev))
        setDetailedCart(prev => updateLogic(prev))
    }

    /* ---------- REMOVE ---------- */
    const removeItem = (productId, variantId) => {
        const filterLogic = (items) => items.filter(i =>
            !((i.productId || i.id) === productId && i.variantId === variantId)
        )
        setCart(prev => filterLogic(prev))
        setDetailedCart(prev => filterLogic(prev))
    }

    /* ---------- COUPON ---------- */
    const applyCoupon = code => {
        if (code === "SAVE10") {
            setCoupon({ code, discount: 0.1 })
        }
    }

    /* ---------- CLEAR CART ---------- */
    const clearCart = () => {
        setCart([])
        setDetailedCart([])
        setCoupon(null)
        setDrawerOpen(false)
    }

    /* ---------- TOTALS ---------- */
    const subtotal = detailedCart.reduce(
        (sum, i) => sum + i.currentPrice * i.quantity,
        0
    )

    const discount = coupon ? subtotal * coupon.discount : 0
    const shipping = 0
    const totalPrice = subtotal - discount + shipping
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                cart,
                detailedCart,
                totalItems,
                subtotal,
                discount,
                shipping,
                totalPrice,
                drawerOpen,
                setDrawerOpen,
                addToCart,
                updateQty,
                removeItem,
                clearCart,
                applyCoupon,
                coupon
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)