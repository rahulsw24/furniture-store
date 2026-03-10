import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Star, Truck, ShieldCheck, Clock, Plus, Minus, Paintbrush, Layers,
    ChevronRight, ChevronLeft, AlertCircle, ShoppingBag, X, Maximize2, ListChecks
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductBySlug, getAllProducts } from '../api/products'
import { useCart } from '../context/CartContext'
import { getImageUrl } from '../utils/getImageUrl'

const BASE_URL = import.meta.env.VITE_API_URL

/* ---------- ANIMATION VARIANTS ---------- */
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
}

/* ---------- HIGHLIGHTS PARSER ---------- */
const renderHighlightsContent = (text) => {
    if (!text) return null;
    const bullets = text.split(/\r?\n/).filter(line => line.trim() !== "");

    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4 pb-6"
        >
            {bullets.map((bullet, i) => {
                const [title, ...descParts] = bullet.split(':');
                const description = descParts.join(':').trim();

                return (
                    <motion.div variants={fadeInUp} key={i} className="flex gap-3 items-start">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {description ? (
                                <>
                                    <span className="font-bold text-black uppercase text-[10px] tracking-widest block mb-0.5">
                                        {title.trim()}
                                    </span>
                                    {description}
                                </>
                            ) : (
                                <span className="font-medium text-gray-900">{bullet}</span>
                            )}
                        </p>
                    </motion.div>
                );
            })}
        </motion.div>
    );
};

/* ---------- ACCORDION CONTENT PARSER ---------- */
const renderAccordionContent = (text, fallback) => {
    if (!text || text.trim() === "") {
        return <p className="text-sm text-gray-600 pb-6">{fallback}</p>;
    }
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    return (
        <div className="text-sm text-gray-600 space-y-2 pb-6">
            {lines.map((line, i) => (
                <p key={i}>{line}</p>
            ))}
        </div>
    );
};

/* ---------- STORY PARSER (Smart Editorial Version) ---------- */
const renderBeautifulStory = (description) => {
    if (!description) return null;

    const hasSeparator = description.includes('---');
    const sections = hasSeparator
        ? description.split('---').map(s => s.trim()).filter(Boolean)
        : description.split('\n\n').map(s => s.trim()).filter(Boolean);

    const heroContent = sections[0];
    const bodySections = sections.slice(1);

    const heroLines = heroContent.split('\n').filter(l => l.trim() !== "");
    const heroTitle = heroLines[0];
    const heroLead = heroLines.slice(1).join('\n');

    return (
        <section className="mt-32 py-32 bg-[#FAF9F6] border-t border-b border-gray-100 -mx-6 md:-mx-12 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">

                {/* --- HERO NARRATIVE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-40"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-8">
                        The Design Story
                    </span>
                    <h3 className="text-5xl md:text-8xl font-serif text-black leading-[1.1] mb-12 tracking-tight max-w-5xl mx-auto">
                        {heroTitle}
                    </h3>

                    {heroLead && (
                        <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed italic max-w-2xl mx-auto">
                            {heroLead}
                        </p>
                    )}

                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: 96 }}
                        viewport={{ once: true }}
                        className="w-px bg-gray-200 mx-auto mt-16"
                    />
                </motion.div>

                {/* --- BODY SECTIONS (Alternating Zig-Zag) --- */}
                {bodySections.length > 0 && (
                    <div className="space-y-48">
                        {bodySections.map((section, index) => {
                            const lines = section.split('\n').filter(l => l.trim() !== "");
                            const isHeaderDetected = lines.length > 1 && lines[0].length < 60;
                            const sectionHeader = isHeaderDetected ? lines[0] : null;
                            const sectionBody = isHeaderDetected ? lines.slice(1).join('\n') : lines.join('\n');

                            const isShifted = index % 2 !== 0;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: isShifted ? 40 : -40 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                                >
                                    <div className={`lg:col-span-7 ${isShifted ? 'lg:col-start-6' : 'lg:col-start-1'}`}>
                                        <div className="relative pl-8 md:pl-16 group">
                                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-hover:bg-black transition-colors duration-500" />

                                            {sectionHeader && (
                                                <h4 className="text-2xl md:text-5xl font-serif text-black mb-8 leading-tight tracking-tight">
                                                    {sectionHeader}
                                                </h4>
                                            )}
                                            <p className="text-lg md:text-xl text-gray-600 leading-[1.9] font-light whitespace-pre-line">
                                                {sectionBody}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* --- CLOSING MARK --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-48 pt-16 border-t border-gray-100 text-center"
                >
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 italic">
                        BoltLess: Built to last, designed to move.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

const ProductDetails = () => {
    const { slug } = useParams()
    const { addToCart, setDrawerOpen } = useCart()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [activeImgIndex, setActiveImgIndex] = useState(0)

    // FIXED: Changed from 'Highlights' to null so accordions start closed
    const [openAccordion, setOpenAccordion] = useState(null)

    const [openFaq, setOpenFaq] = useState(0)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    const [recommended, setRecommended] = useState([])
    const [recLoading, setRecLoading] = useState(true)

    /* ---------- Fetch Main Product ---------- */
    useEffect(() => {
        async function loadProduct() {
            setLoading(true)
            try {
                const data = await getProductBySlug(slug)
                setProduct(data)
                setActiveImgIndex(0)
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
            <Link to="/products" className="px-8 py-4 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest transition-transform hover:scale-105">
                Back to Collection
            </Link>
        </div>
    )

    const images = product.images?.length
        ? product.images.map(img => getImageUrl(img))
        : ['https://via.placeholder.com/800x800'];

    const nextImage = (e) => {
        e?.stopPropagation();
        setActiveImgIndex((prev) => (prev + 1) % images.length);
    };
    const prevImage = (e) => {
        e?.stopPropagation();
        setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 overflow-hidden"
        >
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
                    >
                        <button onClick={() => setIsPreviewOpen(false)} className="absolute top-8 right-8 p-4 bg-black text-white rounded-full hover:scale-110 transition-transform z-[110] shadow-xl"><X size={24} /></button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            <img src={images[activeImgIndex]} alt="Preview" className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl select-none" />
                            {images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                                    <button onClick={prevImage} className="p-5 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-lg active:scale-90"><ChevronLeft size={24} /></button>
                                    <button onClick={nextImage} className="p-5 bg-white border border-gray-100 rounded-full hover:bg-black hover:text-white transition-all shadow-lg active:scale-90"><ChevronRight size={24} /></button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start pt-4 lg:pt-0">
                {/* GALLERY COLUMN */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-7 space-y-6 lg:sticky lg:top-32 order-2 lg:order-1"
                >
                    <div onClick={() => setIsPreviewOpen(true)} className="relative rounded-[2.5rem] overflow-hidden bg-[#F3F3F1] w-full aspect-square lg:aspect-auto lg:h-[70vh] group cursor-zoom-in">
                        <motion.img
                            key={activeImgIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={images[activeImgIndex]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 right-6 p-3 bg-white/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm"><Maximize2 size={20} className="text-black" /></div>
                        {images.length > 1 && (
                            <>
                                <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-xl active:scale-90"><ChevronLeft size={24} /></button>
                                <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-xl active:scale-90"><ChevronRight size={24} /></button>
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-4 pb-10">
                        {images.map((img, i) => (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={i}
                                onClick={() => setActiveImgIndex(i)}
                                className={`aspect-square bg-[#F3F3F1] rounded-2xl overflow-hidden cursor-pointer transition-all border-2 ${activeImgIndex === i ? 'border-black' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img src={img} alt="thumb" className="w-full h-full object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* DETAILS COLUMN (ALIGNED TO TOP OF IMAGE WITH PT-10) */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-5 lg:sticky lg:top-32 self-start pb-20 order-1 lg:order-2 lg:pt-10"
                >
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 leading-[0.9] tracking-tight mt-0">
                            {product.name}
                        </h1>
                        <div className="flex items-baseline gap-4">
                            <p className="text-3xl font-medium text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</p>
                            {product.compare_price && Number(product.compare_price) > Number(product.price) && (
                                <>
                                    <p className="text-xl text-gray-400 line-through decoration-gray-300">₹{Number(product.compare_price).toLocaleString('en-IN')}</p>
                                    <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                        {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { addToCart(product); setDrawerOpen(true); }}
                        className="group w-full bg-black text-white py-5 rounded-full font-bold text-sm tracking-[0.2em] uppercase transition-all hover:bg-gray-800 flex items-center justify-center gap-3 transform shadow-xl shadow-black/10 mt-8"
                    >
                        ADD TO CART <ShoppingBag size={18} />
                    </motion.button>

                    <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-100 my-8">
                        <ValueProp icon={<Clock size={20} />} label="2 Minute Assembly" />
                        <ValueProp icon={<Truck size={20} />} label="Fast Free Shipping" />
                        <ValueProp icon={<ShieldCheck size={20} />} label="No-Hassle Returns" />
                    </div>

                    <div className="pt-4">
                        {product.highlights && (
                            <ProductAccordion
                                title="Product Highlights"
                                isOpen={openAccordion === 'Highlights'}
                                onClick={() => setOpenAccordion(openAccordion === 'Highlights' ? null : 'Highlights')}
                            >
                                {renderHighlightsContent(product.highlights)}
                            </ProductAccordion>
                        )}
                        <ProductAccordion title="Dimensions" isOpen={openAccordion === 'Dimensions'} onClick={() => setOpenAccordion(openAccordion === 'Dimensions' ? null : 'Dimensions')}>
                            {renderAccordionContent(product.dimensions, 'Dimensions vary by configuration.')}
                        </ProductAccordion>
                        <ProductAccordion title="Materials" isOpen={openAccordion === 'Materials'} onClick={() => setOpenAccordion(openAccordion === 'Materials' ? null : 'Materials')}>
                            {renderAccordionContent(product.materials, 'Premium furniture-grade materials.')}
                        </ProductAccordion>
                    </div>
                </motion.div>
            </div>

            <div className="w-full">
                {renderBeautifulStory(product.description)}
            </div>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="py-24 border-t border-gray-100"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard icon={<Clock />} title="2-Minute Assembly" desc="Ditch the hex keys. Our smart joinery takes you from flat-pack to rock-solid in under two minutes." />
                    <FeatureCard icon={<Layers />} title="Furniture-Grade Plywood" desc="13-ply premium plywood that's sustainably sourced and warp-resistant." />
                    <FeatureCard icon={<Paintbrush />} title="Customize It" desc="Arrives sanded smooth and ready to finish. Leave it natural or make it yours with stain or wax." />
                </div>
            </motion.section>

            <section className="py-32 max-w-4xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-serif mb-4 text-black">Got questions?</h2>
                    <p className="text-gray-500 tracking-widest uppercase text-xs font-bold">We got answers</p>
                </div>
                <div className="space-y-4">
                    <FAQItem q="Can I leave it unfinished?" a="Absolutely! Lots of customers love the minimal nature of our furniture." isOpen={openFaq === 0} onClick={() => setOpenFaq(0)} />
                    <FAQItem q="What is your return policy?" a="We offer no-hassle returns within 30 days." isOpen={openFaq === 1} onClick={() => setOpenFaq(1)} />
                </div>
            </section>

            <section className="py-24 border-t border-gray-100">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-2xl font-serif text-black">Recommended</h2>
                    <span className="text-gray-400">|</span>
                    <p className="text-sm text-gray-500">You may also <span className="font-bold text-black">like</span> these products</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recLoading ? [...Array(4)].map((_, i) => (<div key={i} className="animate-pulse"><div className="aspect-square bg-gray-100 rounded-[2rem] mb-4" /><div className="h-4 bg-gray-100 rounded w-2/3" /></div>)) : (
                        recommended.map((item) => (
                            <motion.div whileHover={{ y: -10 }} key={item.id}>
                                <Link to={`/products/${item.slug}`} className="group cursor-pointer">
                                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <img src={getImageUrl(item)} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-black">₹{Number(item.price).toLocaleString('en-IN')}</p>
                                            {item.compare_price && Number(item.compare_price) > Number(item.price) && (
                                                <p className="text-xs text-gray-400 line-through">₹{Number(item.compare_price).toLocaleString('en-IN')}</p>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-lg text-black truncate">{item.name}</h4>
                                        <button className="w-full mt-4 py-3 border border-gray-200 rounded-full text-[11px] font-bold uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all">View product</button>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>
        </motion.main>
    )
}

/* HELPER COMPONENTS */
const ValueProp = ({ icon, label }) => (
    <motion.div variants={fadeInUp} className="flex flex-col items-center text-center gap-3 group">
        <div className="w-11 h-11 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 transition-colors group-hover:border-black">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] leading-tight text-gray-800">{label}</span>
    </motion.div>
)

const ProductAccordion = ({ title, children, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button onClick={onClick} className="w-full py-5 flex items-center justify-between text-left group">
            <span className="text-base font-bold uppercase tracking-wide text-black group-hover:text-gray-500 transition-colors">{title}</span>
            {isOpen ? <Minus size={18} className="text-black" /> : <Plus size={18} className="text-gray-400" />}
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        variants={fadeInUp}
        className="bg-white p-10 rounded-[2rem] border border-gray-50 text-center shadow-sm hover:shadow-lg transition-all duration-500"
    >
        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 group-hover:text-black transition-colors">{icon}</div>
        <h3 className="text-lg font-bold mb-4 text-black">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
)

const FAQItem = ({ q, a, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button onClick={onClick} className="w-full py-6 flex items-center gap-6 text-left font-bold text-lg group text-black">
            <div className="flex-shrink-0">{isOpen ? <Minus size={18} /> : <Plus size={18} className="text-gray-400 group-hover:text-black transition-colors" />}</div>
            {q}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <p className="pl-10 text-gray-600 leading-relaxed max-w-3xl pb-8">{a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
)

export default ProductDetails;