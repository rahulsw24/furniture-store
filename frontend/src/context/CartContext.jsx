import { createContext, useContext, useEffect, useState } from "react"
import { getAllProducts } from "../api/products"

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [drawerOpen, setDrawerOpen] = useState(false)

    const [detailedCart, setDetailedCart] = useState([])
    const [coupon, setCoupon] = useState(null)

    /* ---------- Load ---------- */

    useEffect(() => {
        const saved = localStorage.getItem("cart")
        if (saved) setCart(JSON.parse(saved))
    }, [])

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

            const products = await getAllProducts()

            const hydrated = cart.map(item => {
                const product = products.find(p => p.id === item.productId)

                if (!product) return null

                const currentPrice = product.price

                return {
                    ...product,
                    quantity: item.quantity,

                    /* PRICE CHECK */
                    priceChanged: currentPrice !== item.priceSnapshot,

                    currentPrice,
                    snapshotPrice: item.priceSnapshot
                }
            }).filter(Boolean)

            setDetailedCart(hydrated)
        }

        hydrate()
    }, [cart])

    /* ---------- ADD ---------- */

    const addToCart = (product, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.productId === product.id)

            if (existing) {
                return prev.map(i =>
                    i.productId === product.id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                )
            }

            return [
                ...prev,
                {
                    productId: product.id,
                    quantity: qty,

                    priceSnapshot: product.price,
                    nameSnapshot: product.name,
                    imageSnapshot: product.images?.[0]?.url || null,

                    variantId: null,
                    addedAt: Date.now()
                }
            ]
        })

        setDrawerOpen(true)
    }

    /* ---------- UPDATE ---------- */

    const updateQty = (productId, qty) => {
        if (qty <= 0) return removeItem(productId)

        setCart(prev =>
            prev.map(i =>
                i.productId === productId
                    ? { ...i, quantity: qty }
                    : i
            )
        )
    }

    const removeItem = productId => {
        setCart(prev => prev.filter(i => i.productId !== productId))
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
        setCoupon(null)
        setDrawerOpen(false)
    }

    /* ---------- TOTALS ---------- */

    const subtotal = detailedCart.reduce(
        (sum, i) => sum + i.currentPrice * i.quantity,
        0
    )

    const discount = coupon ? subtotal * coupon.discount : 0

    // Updated to 0 as shipping is included in product price
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