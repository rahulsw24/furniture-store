import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronDown, User } from 'lucide-react';
import { getAllProducts } from '../../api/products';
import { getImageUrl } from '../../utils/getImageUrl';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [menuProducts, setMenuProducts] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const { totalItems, setDrawerOpen } = useCart();
    const { user } = useAuth();

    const BASE_URL = import.meta.env.VITE_API_URL;

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY;

            // 1. Detect if we have scrolled past the Promo Bar (approx 40px)
            setIsScrolled(currentScrollY > 40);

            // 2. Hide/Show logic
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                // Scrolling Down - Hide
                setIsVisible(false);
                setShowMegaMenu(false);
            } else {
                // Scrolling Up or at the very top - Show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    useEffect(() => {
        async function loadMenuProducts() {
            try {
                const data = await getAllProducts();
                setMenuProducts(data.slice(0, 6));
            } catch (err) {
                console.error('Failed to load menu products', err);
            } finally {
                setMenuLoading(false);
            }
        }
        loadMenuProducts();
    }, []);

    return (
        <>
            {/* 1. PROMO BAR - Sits at the top of the document flow */}
            <div className="w-full bg-[#E5DACE] text-black text-[10px] sm:text-[11px] tracking-[0.2em] py-2.5 text-center uppercase font-medium relative z-[60]">
                PRESIDENTS DAY SALE: 15% OFF + FREE SHIPPING
            </div>

            {/* 2. HEADER - Becomes fixed/sticky based on scroll */}
            <header
                className={`
                    left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out
                    ${isScrolled ? 'fixed top-0 shadow-sm backdrop-blur-md bg-white/90' : 'relative bg-white'}
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                `}
                onMouseLeave={() => setShowMegaMenu(false)}
            >
                <nav className="flex items-center justify-between px-6 py-5 md:px-12 max-w-[1440px] mx-auto">
                    <div className="flex-1">
                        <Search className="w-5 h-5 cursor-pointer text-black hover:opacity-60 transition" />
                    </div>

                    <div className="flex-none">
                        <Link to="/">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer uppercase text-black">UNFNSHED</h1>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-5">
                        <Link to={user ? "/account" : "/login"}>
                            <User className="w-5 h-5 cursor-pointer hidden md:block hover:opacity-60 transition text-black" />
                        </Link>
                        <div
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-1 cursor-pointer group text-black"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="text-xs font-medium">
                                ({totalItems})
                            </span>
                        </div>
                    </div>
                </nav>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center justify-center gap-8 pb-4">
                    {['Best Sellers', 'Products', 'How to Assemble', 'Our Story', 'Reach out'].map((item) => {
                        const isProducts = item === 'Products';
                        const isReachOut = item === 'Reach out';
                        const isBestSellers = item === 'Best Sellers';

                        return (
                            <div
                                key={item}
                                className="flex items-center gap-1 cursor-pointer group py-2"
                                onMouseEnter={() => isBestSellers ? setShowMegaMenu(true) : setShowMegaMenu(false)}
                            >
                                {isProducts || isReachOut ? (
                                    <Link
                                        to={isProducts ? "/products" : "/reach-out"}
                                        className="text-[11px] uppercase tracking-widest font-semibold text-black hover:text-gray-500 transition-colors"
                                    >
                                        {item}
                                    </Link>
                                ) : (
                                    <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${isBestSellers && showMegaMenu ? 'text-gray-400 underline underline-offset-8' : 'text-black group-hover:text-gray-500'}`}>
                                        {item}
                                    </span>
                                )}

                                {isBestSellers && (
                                    <ChevronDown className={`w-3 h-3 transition-transform text-black ${showMegaMenu ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mega Menu Dropdown */}
                <div
                    className={`
                        absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 ease-out overflow-hidden
                        ${showMegaMenu ? 'opacity-100 visible max-h-[600px] shadow-xl' : 'opacity-0 invisible max-h-0'}
                    `}
                >
                    <div className="max-w-[1440px] mx-auto px-12 py-10">
                        <div className="grid grid-cols-6 gap-6">
                            {menuLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-3 animate-pulse">
                                        <div className="aspect-square bg-gray-200 rounded-2xl" />
                                        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
                                        <div className="h-4 bg-gray-300 rounded w-full" />
                                    </div>
                                ))
                            ) : (
                                menuProducts.map((product) => {
                                    const imageUrl = getImageUrl(product, BASE_URL)
                                    return (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.slug}`}
                                            className="group cursor-pointer"
                                            onClick={() => setShowMegaMenu(false)}
                                        >
                                            <div className="aspect-square bg-[#F3F3F1] rounded-2xl overflow-hidden mb-3">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <p className="text-[11px] text-gray-500 mb-1">₹{product.price}</p>
                                            <h4 className="text-[13px] font-bold text-black">{product.name}</h4>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                        <Link
                            to="/products"
                            onClick={() => setShowMegaMenu(false)}
                            className="inline-block mt-10 px-8 py-3 border border-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-black"
                        >
                            Shop All
                        </Link>
                    </div>
                </div>
            </header>

            {/* 3. SPACER - Only visible when the header is fixed to prevent the content from jumping up */}
            {isScrolled && <div className="h-[120px] w-full" />}
        </>
    );
};

export default Navbar;