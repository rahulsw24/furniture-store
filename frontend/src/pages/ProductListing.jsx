import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';
import { getAllProducts } from '../api/products';
import { getImageUrl } from '../utils/getImageUrl';


const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    if (loading) {
        return (
            <section className="px-6 md:px-12 py-40 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-gray-200 rounded-[2.5rem] mb-6" />
                            <div className="h-6 bg-gray-200 rounded mb-2 w-2/3" />
                            <div className="h-4 bg-gray-300 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </section>
        )
    }

    return (
        <div className="bg-white">
            {/* --- HEADER SECTION --- */}
            <header className="py-20 px-6 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                    Shop All Tool Free Modern Furniture
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Minimalist furniture that assembles in 2 minutes. Made in USA from premium plywood, ready to customize.
                </p>
                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-3">
                    {['USA Made', '2-Min Assembly', 'Premium Plywood'].map((tag) => (
                        <span key={tag} className="px-6 py-2 bg-[#F3F3F1] rounded-full text-xs font-bold uppercase tracking-widest text-gray-800 border border-transparent hover:border-gray-300 cursor-pointer transition-all">
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* --- PRODUCT GRID --- */}
            <section className="px-6 md:px-12 pb-24 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product) => (
                        <ListingCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* --- CUSTOMER REVIEWS STRIP --- */}
            <section className="bg-[#F9F9F9] py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header with Black Box */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
                        <div className="bg-black text-white px-6 py-4 text-3xl font-serif rounded-sm">
                            Customers love us
                        </div>
                        <div className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md bg-white">
                            <div className="flex text-black">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            <span className="text-sm font-medium">from 1014 reviews</span>
                            <CheckCircle2 size={16} className="text-green-500 ml-1" />
                        </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-6">
                        <ReviewRow
                            name="Kare F"
                            product="unfnshed"
                            title="Easy purchase"
                            body="Easy purchase and slower delivery kind of emphasizes the fact that these are quality tables made by HUMANS!"
                        />
                        <ReviewRow
                            name="Kare F"
                            product="Side Table"
                            title="Large and Small side tables can nest in eachother!"
                            body="Very cool product with simple design. I don't think they really market this, but the small 12' side table is exactly low enough to nest under the large 18' side table."
                            img="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=60&w=200"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

/* --- SUB-COMPONENTS --- */
const BASE_URL = import.meta.env.VITE_API_URL

const ListingCard = ({ product }) => {

    // Clean and simple
    const imageUrl = getImageUrl(product);

    return (
        <div className="group flex flex-col h-full">

            <Link
                to={`/products/${product.slug}`}
                className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-[#F3F3F1] mb-6"
            >
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {product.badge && (
                    <span className="absolute top-6 right-6 px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase rounded-full shadow-sm">
                        {product.badge}
                    </span>
                )}
            </Link>

            <div className="flex flex-col flex-grow px-2">

                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-serif text-gray-900 group-hover:underline underline-offset-4 cursor-pointer">
                        {product.name}
                    </h3>
                </div>

                {/* Ratings Row */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-black">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                        ))}
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">
                        326 reviews
                    </span>
                </div>

                <p className="text-lg font-medium text-gray-700 mb-6">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                </p>

                <Link
                    to={`/products/${product.slug}`}
                    className="mt-auto w-full py-4 border border-gray-300 rounded-full text-center text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white hover:border-black active:scale-[0.98]"
                >
                    Shop Now
                </Link>

            </div>
        </div>
    )
}


const ReviewRow = ({ name, product, title, body, img }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm flex gap-6">
        {img && <img src={img} className="w-24 h-24 object-cover rounded-lg hidden md:block" alt="Review" />}
        <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-sm text-gray-900">{name}</span>
                    <span className="text-xs text-gray-400 ml-2">reviewed {product}</span>
                </div>
                <div className="flex text-black">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" strokeWidth={0} />)}
                </div>
            </div>
            <h4 className="font-bold text-md text-gray-900 mb-2 leading-tight">{title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
        </div>
    </div>
);

export default ProductListing;