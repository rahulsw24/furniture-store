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
            setIsScrolled(currentScrollY > 40);

            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setIsVisible(false);
                setShowMegaMenu(false);
            } else {
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
            {/* PROMO BAR */}
            <div className="w-full bg-[#1A1A1A] text-white text-[9px] sm:text-[10px] tracking-[0.3em] py-2.5 text-center uppercase font-bold relative z-[60]">
                BOLTLESS: THE FUTURE OF TOOL-FREE ASSEMBLY
            </div>

            {/* HEADER */}
            <header
                className={`
                    left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out
                    ${isScrolled ? 'fixed top-0 shadow-xl backdrop-blur-xl bg-white/80' : 'relative bg-white'}
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                `}
                onMouseLeave={() => setShowMegaMenu(false)}
            >
                <nav className="flex items-center justify-between px-6 py-6 md:px-12 max-w-[1440px] mx-auto">
                    <div className="flex-1">
                        <Search className="w-5 h-5 cursor-pointer text-black hover:scale-110 transition-transform" />
                    </div>

                    {/* STYLIZED LOGO SECTION */}
                    <div className="flex-none">
                        <Link to="/" className="group flex flex-col items-center">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter cursor-pointer text-black leading-none inline-flex items-baseline">
                                BOLT
                                <span className="text-gray-400 font-light">LESS</span>
                                <span className="w-1.5 h-1.5 bg-black rounded-full ml-1 mb-1"></span>
                            </h1>
                            <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-gray-400 mt-1 transition-all group-hover:text-black group-hover:tracking-[0.6em]">
                                Modern Furniture
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-6">
                        <Link to={user ? "/account" : "/login"}>
                            <User className="w-5 h-5 cursor-pointer hidden md:block hover:text-gray-400 transition-colors text-black" />
                        </Link>
                        <div
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 cursor-pointer group px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-black/5 active:scale-95"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="text-[10px] font-bold tracking-widest uppercase">
                                Cart ({totalItems})
                            </span>
                        </div>
                    </div>
                </nav>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center justify-center gap-10 pb-6">
                    {['Best Sellers', 'Products', 'How it Works', 'Our Story', 'Reach Out'].map((item) => {
                        const isProducts = item === 'Products';
                        const isBestSellers = item === 'Best Sellers';
                        const isReachOut = item === 'Reach Out'; // Added check for Reach Out

                        // Determine the path based on the item name
                        let targetPath = "#";
                        if (isProducts) targetPath = "/products";
                        if (isReachOut) targetPath = "/reach-out";

                        return (
                            <div
                                key={item}
                                className="flex items-center gap-1 cursor-pointer group py-2"
                                onMouseEnter={() => isBestSellers ? setShowMegaMenu(true) : setShowMegaMenu(false)}
                            >
                                <Link
                                    to={targetPath}
                                    className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative
                        ${isBestSellers && showMegaMenu ? 'text-black' : 'text-gray-500 hover:text-black'}
                    `}
                                >
                                    {item}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full ${isBestSellers && showMegaMenu ? 'w-full' : ''}`}></span>
                                </Link>
                                {isBestSellers && (
                                    <ChevronDown size={12} className={`transition-transform text-black ${showMegaMenu ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mega Menu Dropdown */}
                <div
                    className={`
                        absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-500 ease-in-out overflow-hidden
                        ${showMegaMenu ? 'opacity-100 visible max-h-[600px] shadow-2xl' : 'opacity-0 invisible max-h-0'}
                    `}
                >
                    <div className="max-w-[1440px] mx-auto px-12 py-12">
                        <div className="grid grid-cols-6 gap-8">
                            {menuLoading ? (
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="animate-pulse space-y-4">
                                        <div className="aspect-square bg-gray-100 rounded-3xl" />
                                        <div className="h-4 bg-gray-100 rounded w-full" />
                                    </div>
                                ))
                            ) : (
                                menuProducts.map((product) => {
                                    const imageUrl = getImageUrl(product);
                                    return (
                                        <Link
                                            key={product.id}
                                            to={`/products/${product.slug}`}
                                            className="group cursor-pointer block"
                                            onClick={() => setShowMegaMenu(false)}
                                        >
                                            <div className="aspect-[4/5] bg-[#F9F9F9] rounded-[2rem] overflow-hidden mb-4 border border-transparent group-hover:border-gray-200 transition-all">
                                                <img
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 mb-1 tracking-widest uppercase">₹{product.price}</p>
                                            <h4 className="text-[12px] font-bold text-black group-hover:underline underline-offset-4">{product.name}</h4>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER */}
            {isScrolled && <div className="h-[140px] w-full" />}
        </>
    );
};

export default Navbar;