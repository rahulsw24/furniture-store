import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Star, Truck, ShieldCheck, Clock, Plus, Minus, Paintbrush, Layers, ChevronRight, AlertCircle, ShoppingBag
} from 'lucide-react'
import { getProductBySlug, getAllProducts } from '../api/products'
import { useCart } from '../context/CartContext'

const BASE_URL = import.meta.env.VITE_API_URL

const ProductDetails = () => {
    const { slug } = useParams()
    const { addToCart, setDrawerOpen } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [openAccordion, setOpenAccordion] = useState('Dimensions')
    const [openFaq, setOpenFaq] = useState(0)

    const [recommended, setRecommended] = useState([])
    const [recLoading, setRecLoading] = useState(true)

    /* ---------- Fetch Main Product ---------- */
    useEffect(() => {
        async function loadProduct() {
            setLoading(true)
            try {
                const data = await getProductBySlug(slug)
                setProduct(data)
                setError(null)
            } catch (err) {
                console.error(err)
                setError('Failed to load product details.')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
        window.scrollTo(0, 0) // Reset scroll on product change
    }, [slug])

    /* ---------- Fetch Recommended ---------- */
    useEffect(() => {
        async function loadRecommended() {
            try {
                const all = await getAllProducts()
                const filtered = all.filter(p => p.slug !== slug)
                setRecommended(filtered.slice(0, 4))
            } catch (err) {
                console.error('Failed to load recommended products', err)
            } finally {
                setRecLoading(false)
            }
        }
        loadRecommended()
    }, [slug])

    /* ---------- HIGH-END SKELETON LOADER ---------- */
    if (loading) {
        return (
            <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 animate-pulse">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="rounded-[2.5rem] bg-gray-100 aspect-square w-full" />
                        <div className="grid grid-cols-4 gap-4 pb-20">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 space-y-8 self-start">
                        <div className="space-y-4">
                            <div className="h-12 bg-gray-200 rounded-xl w-3/4" />
                            <div className="h-8 bg-gray-100 rounded-lg w-1/4" />
                        </div>
                        <div className="w-full h-16 bg-gray-200 rounded-full" />
                        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-50">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gray-100" />
                                    <div className="h-2 bg-gray-100 rounded-full w-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    /* ---------- ERROR STATE ---------- */
    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <AlertCircle size={48} className="text-gray-200" />
            <p className="text-gray-900 font-serif text-2xl">{error}</p>
            <Link to="/products" className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105">
                Back to Collection
            </Link>
        </div>
    )

    const images = product.images?.length
        ? product.images.map(img => img.url.startsWith('http') ? img.url : BASE_URL + img.url)
        : ['https://via.placeholder.com/800x800']

    return (
        <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 overflow-hidden">

            {/* SECTION 1: MAIN PRODUCT INTERACTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* GALLERY */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="rounded-[2.5rem] overflow-hidden bg-[#F3F3F1] aspect-square group">
                        <img src={images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <div className="grid grid-cols-4 gap-4 pb-20">
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square bg-[#F3F3F1] rounded-2xl overflow-hidden cursor-pointer hover:opacity-80 transition-all border border-transparent hover:border-gray-200">
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* STICKY INFO BAR */}
                <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32 self-start pb-20">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2 leading-tight">{product.name}</h1>
                        <p className="text-2xl font-medium text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => {
                                addToCart(product)
                                setDrawerOpen(true)
                            }}
                            className="group w-full bg-black text-white py-5 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-gray-800 flex items-center justify-center gap-3 transform active:scale-95"
                        >
                            ADD TO CART <ShoppingBag size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[13px] font-medium text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> In Stock. Ships in 1-3 days
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-100">
                        <ValueProp icon={<Clock size={20} />} label="2 Minute Assembly" />
                        <ValueProp icon={<Truck size={20} />} label="Fast Free Shipping" />
                        <ValueProp icon={<ShieldCheck size={20} />} label="No-Hassle Returns" />
                    </div>

                    <div className="pt-4">
                        <ProductAccordion title="Dimensions" isOpen={openAccordion === 'Dimensions'} onClick={() => setOpenAccordion('Dimensions')}>
                            <div className="text-sm text-gray-600 space-y-2 pb-6">
                                <p>Width: 48"</p><p>Depth: 24"</p><p>Height: 18"</p>
                            </div>
                        </ProductAccordion>
                        <ProductAccordion title="Materials" isOpen={openAccordion === 'Materials'} onClick={() => setOpenAccordion('Materials')}>
                            <p className="text-sm text-gray-600 pb-6">Premium furniture-grade Baltic Birch Plywood. Arrives sanded smooth and ready for your finish.</p>
                        </ProductAccordion>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex text-black mb-2 gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed italic">"Super easy to put together. Really upscale design and look! It made our living room feel elevated instantly."</p>
                        <p className="text-xs font-bold mt-2 text-gray-900 tracking-tight">K.S. <span className="text-green-600 font-medium ml-1">Verified review</span></p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: THE STORY (LONG DESCRIPTION) */}
            <section className="mt-20 py-24 border-t border-gray-100 max-w-4xl mx-auto text-center space-y-8 px-4">
                <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
                    The {product.name}: <br /> Storage, Simplified.
                </h2>
                <div className="prose prose-lg mx-auto">
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        {product.description || 'Crafted from premium Baltic birch plywood, this piece is a blank canvas designed to adapt to your life.'}
                    </p>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed pt-4">
                        Engineered for strength and simplicity, our system assembles in seconds without a single screw or tool. Whether you need a plant stand, a shoe organizer, or a bedside table, we offer furniture-grade quality that you can paint, stain, or seal to match your unique style.
                    </p>
                </div>
            </section>

            {/* SECTION 3: WHY CUSTOMERS LOVE IT */}
            <section className="py-24 border-t border-gray-100">
                <h2 className="text-center text-3xl font-serif mb-16">Why Customers Love It</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<Clock />} title="2-Minute, No-Tool Assembly" desc="Ditch the hex keys. Our smart joinery takes you from flat-pack to rock-solid in under two minutes." />
                    <FeatureCard icon={<Layers />} title="Furniture-Grade Plywood" desc="13-ply premium plywood that's sustainably sourced, warp-resistant, and far stronger than particle board." />
                    <FeatureCard icon={<Paintbrush />} title="Your Canvas to Customize" desc="Arrives sanded smooth and ready to finish. Leave it natural or make it yours with paint, stain, or wax." />
                </div>
            </section>

            {/* SECTION 4: ALTERNATING INFO BLOCKS */}
            <section className="space-y-12">
                <InfoBlock
                    title="Beautifully Unfnshed"
                    desc={`Unfnshed doesn't mean you have to paint or stain your ${product.name} right away. Take some time to think over what you want and then dive right in!`}
                    img="https://images.unsplash.com/photo-1594620302200-9a762244a156"
                />
                <InfoBlock
                    title="Crafted in the USA"
                    desc="Each one of our products is designed and manufactured at our California-based studio with sustainable practices."
                    img="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                    reverse
                    btnText="Our beliefs"
                />
            </section>

            {/* SECTION 5: FAQ */}
            <section className="py-32 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif mb-4">Got questions?</h2>
                    <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">We got answers</p>
                </div>
                <div className="space-y-4">
                    <FAQItem
                        q="Can I leave it unfinished?"
                        a="Absolutely! Lots of customers love the minimal nature of our furniture (we do too). When you get it you can simply assemble and worry about making it uniquely yours later. Or not!"
                        isOpen={openFaq === 0} onClick={() => setOpenFaq(0)}
                    />
                    <FAQItem q="What are your products made from?" a="We exclusively use Premium furniture-grade Baltic Birch Plywood for its incredible strength-to-weight ratio and clean aesthetics." isOpen={openFaq === 1} onClick={() => setOpenFaq(1)} />
                    <FAQItem q="What is your return policy?" a="We offer no-hassle returns within 30 days. If you aren't happy with the fit or finish, we'll make it right." isOpen={openFaq === 2} onClick={() => setOpenFaq(2)} />
                </div>
            </section>

            {/* SECTION 6: RECOMMENDED */}
            <section className="py-24 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-2xl font-serif">Recommended</h2>
                    <span className="text-gray-400">|</span>
                    <p className="text-sm text-gray-500">You may also <span className="font-bold text-black">like</span> these products</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recLoading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-gray-100 rounded-[2rem] mb-4" />
                                <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                                <div className="h-5 bg-gray-200 rounded w-full" />
                            </div>
                        ))
                    ) : (
                        recommended.map(item => (
                            <Link key={item.id} to={`/products/${item.slug}`} className="group cursor-pointer">
                                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-4">
                                    <img
                                        src={item.images?.[0]?.url.startsWith('http') ? item.images[0].url : BASE_URL + item.images?.[0]?.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500">From ₹{Number(item.price).toLocaleString('en-IN')}</p>
                                    <h4 className="font-bold text-lg">{item.name}</h4>
                                    <button className="w-full mt-4 py-3 border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all">
                                        View product
                                    </button>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </main>
    )
}

/* HELPER COMPONENTS */

const ValueProp = ({ icon, label }) => (
    <div className="flex flex-col items-center text-center gap-3">
        <div className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 transition-colors group-hover:border-black">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-tight">{label}</span>
    </div>
)

const ProductAccordion = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left group">
            <span className="text-base font-bold uppercase tracking-wide group-hover:text-gray-500 transition-colors">{title}</span>
            {isOpen ? <Minus size={18} /> : <Plus size={18} className="text-gray-400" />}
        </button>
        <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>{children}</div>
    </div>
)

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-10 rounded-[2rem] border border-gray-50 text-center shadow-sm hover:shadow-xl transition-shadow duration-500">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">{icon}</div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
)

const InfoBlock = ({ title, desc, img, reverse, btnText = "About Us" }) => (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-[#F9F9F9] rounded-[3rem] overflow-hidden min-h-[550px]`}>
        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center items-center text-center">
            <h2 className="text-5xl font-serif mb-8 leading-tight">{title}</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">{desc}</p>
            <button className="px-10 py-4 border border-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all transform active:scale-95">{btnText}</button>
        </div>
        <div className="flex-1 overflow-hidden">
            <img src={img} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
        </div>
    </div>
)

const FAQItem = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button onClick={onClick} className="w-full py-6 flex items-center gap-6 text-left font-bold text-lg group">
            <div className="flex-shrink-0">{isOpen ? <Minus size={18} /> : <Plus size={18} className="text-gray-400 group-hover:text-black transition-colors" />}</div>
            {q}
        </button>
        <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <p className="pl-10 text-gray-600 leading-relaxed max-w-3xl">{a}</p>
        </div>
    </div>
)

export default ProductDetails;