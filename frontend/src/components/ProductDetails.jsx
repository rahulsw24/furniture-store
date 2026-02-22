import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Star, Truck, ShieldCheck, Clock, Plus, Minus, Paintbrush, Layers,
    ChevronRight, ChevronLeft, AlertCircle, ShoppingBag
} from 'lucide-react'
import { getProductBySlug, getAllProducts } from '../api/products'
import { useCart } from '../context/CartContext'
import { getImageUrl } from '../utils/getImageUrl'

const BASE_URL = import.meta.env.VITE_API_URL

const ProductDetails = () => {
    const { slug } = useParams()
    const { addToCart, setDrawerOpen } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Gallery State
    const [activeImgIndex, setActiveImgIndex] = useState(0)

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
                setActiveImgIndex(0) // Reset to first image when changing products
                setError(null)
            } catch (err) {
                console.error(err)
                setError('Failed to load product details.')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
        window.scrollTo(0, 0)
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

    /* ---------- SKELETON LOADER ---------- */
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
                        <div className="h-12 bg-gray-200 rounded-xl w-3/4" />
                        <div className="h-8 bg-gray-100 rounded-lg w-1/4" />
                        <div className="w-full h-16 bg-gray-200 rounded-full" />
                    </div>
                </div>
            </main>
        )
    }

    if (error) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <AlertCircle size={48} className="text-gray-200" />
            <p className="text-gray-900 font-serif text-2xl">{error}</p>
            <Link to="/products" className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest">
                Back to Collection
            </Link>
        </div>
    )

    const images = product.images?.length
        ? product.images.map(img => getImageUrl(img))
        : ['https://via.placeholder.com/800x800'];

    // Gallery Nav Handlers
    const nextImage = (e) => {
        e.stopPropagation();
        setActiveImgIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = (e) => {
        e.stopPropagation();
        setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 overflow-hidden">

            {/* SECTION 1: MAIN PRODUCT INTERACTION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* GALLERY */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Main Preview */}
                    <div className="relative rounded-[2.5rem] overflow-hidden bg-[#F3F3F1] aspect-square group cursor-zoom-in">
                        <img
                            src={images[activeImgIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-700"
                        />

                        {/* Nav Arrows - Only show if multiple images */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-xl active:scale-90"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-xl active:scale-90"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-4 pb-20">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImgIndex(i)}
                                className={`aspect-square bg-[#F3F3F1] rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${activeImgIndex === i
                                    ? 'border-black scale-[0.98]'
                                    : 'border-transparent opacity-50 hover:opacity-100'
                                    }`}
                            >
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
                            className="group w-full bg-black text-white py-5 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-gray-800 flex items-center justify-center gap-3 transform active:scale-95 shadow-xl shadow-black/10"
                        >
                            ADD TO CART <ShoppingBag size={18} />
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
                        <p className="text-sm text-gray-700 leading-relaxed italic">"Super easy to put together. It made our living room feel elevated instantly."</p>
                    </div>
                </div>
            </div>

            {/* SECTION 2: THE STORY */}
            <section className="mt-20 py-24 border-t border-gray-100 max-w-4xl mx-auto text-center space-y-8 px-4">
                <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
                    The {product.name}: <br /> Storage, Simplified.
                </h2>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    {product.description || 'Crafted from premium Baltic birch plywood, this piece is a blank canvas designed to adapt to your life.'}
                </p>
            </section>

            {/* SECTION 3: FEATURES */}
            <section className="py-24 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<Clock />} title="2-Minute Assembly" desc="Ditch the hex keys. Our smart joinery takes you from flat-pack to rock-solid in under two minutes." />
                    <FeatureCard icon={<Layers />} title="Furniture-Grade Plywood" desc="13-ply premium plywood that's sustainably sourced and warp-resistant." />
                    <FeatureCard icon={<Paintbrush />} title="Customize It" desc="Arrives sanded smooth and ready to finish. Leave it natural or make it yours with stain or wax." />
                </div>
            </section>

            {/* SECTION 4: INFO BLOCKS */}
            <section className="space-y-12">
                <InfoBlock
                    title="Beautifully Unfnshed"
                    desc={`Unfnshed doesn't mean you have to paint or stain your ${product.name} right away. Take some time to think over what you want!`}
                    img="https://images.unsplash.com/photo-1594620302200-9a762244a156"
                />
            </section>

            {/* SECTION 5: FAQ */}
            <section className="py-32 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif mb-4">Got questions?</h2>
                    <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">We got answers</p>
                </div>
                <div className="space-y-4">
                    <FAQItem q="Can I leave it unfinished?" a="Absolutely! Lots of customers love the minimal nature of our furniture." isOpen={openFaq === 0} onClick={() => setOpenFaq(0)} />
                    <FAQItem q="What is your return policy?" a="We offer no-hassle returns within 30 days." isOpen={openFaq === 1} onClick={() => setOpenFaq(1)} />
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
                                <div className="h-4 bg-gray-100 rounded w-2/3" />
                            </div>
                        ))
                    ) : (
                        recommended.map((item) => {
                            const recImageUrl = getImageUrl(item);
                            return (
                                <Link key={item.id} to={`/products/${item.slug}`} className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-4">
                                        <img src={recImageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">From ₹{Number(item.price).toLocaleString('en-IN')}</p>
                                        <h4 className="font-bold text-lg">{item.name}</h4>
                                        <button className="w-full mt-4 py-3 border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all">
                                            View product
                                        </button>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>
        </main>
    )
}

/* HELPER COMPONENTS */
const ValueProp = ({ icon, label }) => (
    <div className="flex flex-col items-center text-center gap-3">
        <div className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-900">{icon}</div>
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
    <div className="bg-white p-10 rounded-[2rem] border border-gray-50 text-center shadow-sm">
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">{icon}</div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
)

const InfoBlock = ({ title, desc, img, reverse }) => (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-[#F9F9F9] rounded-[3rem] overflow-hidden min-h-[550px]`}>
        <div className="flex-1 p-12 lg:p-24 flex flex-col justify-center items-center text-center">
            <h2 className="text-5xl font-serif mb-8 leading-tight">{title}</h2>
            <p className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed">{desc}</p>
        </div>
        <div className="flex-1 overflow-hidden">
            <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
    </div>
)

const FAQItem = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button onClick={onClick} className="w-full py-6 flex items-center gap-6 text-left font-bold text-lg group">
            <div className="flex-shrink-0">{isOpen ? <Minus size={18} /> : <Plus size={18} className="text-gray-400" />}</div>
            {q}
        </button>
        <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
            <p className="pl-10 text-gray-600 leading-relaxed max-w-3xl">{a}</p>
        </div>
    </div>
)

export default ProductDetails;