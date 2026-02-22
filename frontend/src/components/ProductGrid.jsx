import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' // Import Link for navigation
import { Star } from 'lucide-react'
import { getAllProducts } from '../api/products'
import { getImageUrl } from '../utils/getImageUrl'


// Ensure this matches your Payload CMS image URL structure
const BASE_URL = import.meta.env.VITE_API_URL

/* ---------------- Product Card ---------------- */

const ProductCard = ({ product }) => {
    // Payload uses the 'url' field directly for Cloudinary images usually
    const imageUrl = getImageUrl(product); // Fixed!

    return (
        // Wrap the card in a Link component pointing to the slug
        <Link to={`/products/${product.slug}`} className="group cursor-pointer text-left block">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#F3F3F1] mb-4">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    loading="lazy"
                />

                {product.badge && (
                    <span
                        className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10 ${product.badge.includes('Save')
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                            }`}
                    >
                        {product.badge}
                    </span>
                )}
            </div>

            <div className="space-y-1 px-1">
                <h3 className="text-base font-semibold text-gray-900">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1">
                    <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                        ))}
                    </div>
                </div>

                <p className="text-[15px] font-medium text-gray-700">
                    ₹{product.price}
                </p>
            </div>
        </Link>
    )
}

/* ---------------- Product Grid ---------------- */

const ProductGrid = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getAllProducts()
                setProducts(data)
            } catch (err) {
                console.error(err)
                setError('Failed to load products')
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    if (loading) return <section className="py-20 text-center"><p>Loading products...</p></section>
    if (error) return <section className="py-20 text-center text-red-500"><p>{error}</p></section>
    if (!products.length) return <section className="py-20 text-center"><p>No products available</p></section>

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-[1440px] mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-serif mb-12 text-gray-900">
                    Best Sellers
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
                    {products.map((product) => (
                        <ProductCard key={product.id || product.slug} product={product} />
                    ))}
                </div>

                <button className="inline-block px-12 py-4 border border-black rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white active:scale-95">
                    View all products
                </button>
            </div>
        </section>
    )
}

export default ProductGrid