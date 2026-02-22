import React, { useEffect, useState } from 'react'
import {
    getCart,
    updateQuantity,
    removeFromCart
} from '../utils/cart'
import { getAllProducts } from '../api/products'

const BASE_URL = import.meta.env.VITE_API_URL

const Cart = () => {
    const [cartItems, setCartItems] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCart() {
            const cart = getCart()
            const allProducts = await getAllProducts()

            // Merge cart with product data
            const merged = cart.map(item => {
                const product = allProducts.find(p => p.id === item.productId)
                return { ...product, quantity: item.quantity }
            }).filter(Boolean)

            setCartItems(merged)
            setProducts(allProducts)
            setLoading(false)
        }

        loadCart()
    }, [])

    function handleQuantity(id, qty) {
        if (qty < 1) return
        updateQuantity(id, qty)

        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: qty } : item
            )
        )
    }

    function handleRemove(id) {
        removeFromCart(id)
        setCartItems(prev => prev.filter(item => item.id !== id))
    }

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    if (loading) return <div className="py-40 text-center">Loading cart...</div>

    if (!cartItems.length)
        return <div className="py-40 text-center">Your cart is empty</div>

    return (
        <main className="max-w-5xl mx-auto px-6 py-20">

            <h1 className="text-4xl font-serif mb-12">Your Cart</h1>

            <div className="space-y-8">

                {cartItems.map(item => {

                    const imageUrl =
                        item.images?.[0]?.url
                            ? item.images[0].url.startsWith('http')
                                ? item.images[0].url
                                : BASE_URL + item.images[0].url
                            : 'https://via.placeholder.com/200'

                    return (
                        <div
                            key={item.id}
                            className="flex gap-6 border-b pb-8"
                        >

                            <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-32 h-32 object-cover rounded-xl"
                            />

                            <div className="flex-1">

                                <h2 className="text-xl font-bold">{item.name}</h2>

                                <p className="text-gray-600 mb-4">
                                    ₹{item.price.toLocaleString('en-IN')}
                                </p>

                                {/* Quantity Controls */}

                                <div className="flex items-center gap-3 mb-4">

                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 border rounded"
                                    >−</button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() => handleQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 border rounded"
                                    >+</button>

                                </div>

                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-sm text-red-500"
                                >
                                    Remove
                                </button>

                            </div>

                            <div className="font-bold">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>

                        </div>
                    )
                })}
            </div>

            {/* Total */}

            <div className="text-right mt-12">

                <p className="text-2xl font-bold mb-4">
                    Total: ₹{total.toLocaleString('en-IN')}
                </p>

                <button className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest">
                    Checkout
                </button>

            </div>

        </main>
    )
}

export default Cart