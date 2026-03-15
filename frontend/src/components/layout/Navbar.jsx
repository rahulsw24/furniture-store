import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronDown, User, X, Loader2, Menu } from 'lucide-react';
import { getAllProducts } from '../../api/products';
import { getImageUrl } from '../../utils/getImageUrl';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile menu
    const [menuProducts, setMenuProducts] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const { totalItems, setDrawerOpen } = useCart();
    const { user } = useAuth();

    const BASE_URL = import.meta.env.VITE_API_URL;

    // --- DYNAMIC PROMO BAR STATE ---
    const [promoText, setPromoText] = useState('BOLTLESS: THE FUTURE OF TOOL-FREE ASSEMBLY');

    // --- SEARCH LOGIC STATES ---
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // --- FETCH PROMO BAR DATA ---
    useEffect(() => {
        async function fetchPromo() {
            try {
                const res = await fetch(`${BASE_URL}/api/globals/promo-bar`);
                const data = await res.json();

                if (data) {
                    const now = new Date();
                    const validUntil = data.valid_until ? new Date(data.valid_until) : null;

                    // If no date is set, or if we haven't reached the date yet, show promo text
                    if (!validUntil || now < validUntil) {
                        setPromoText(data.text);
                    } else {
                        setPromoText(data.fallback_text);
                    }
                }
            } catch (err) {
                console.error("Promo fetch failed", err);
            }
        }
        fetchPromo();
    }, [BASE_URL]);

    // --- DEBOUNCE SEARCH EFFECT ---
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`${BASE_URL}/api/products?where[name][contains]=${searchQuery}&limit=5`);
                const data = await res.json();
                setSearchResults(data.docs || []);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY;
            const scrollDiff = Math.abs(currentScrollY - lastScrollY);
            const scrollThreshold = 20;

            setIsScrolled(currentScrollY > 40);

            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setIsVisible(false);
                setShowMegaMenu(false);
            } else if (currentScrollY < lastScrollY && scrollDiff > scrollThreshold) {
                setIsVisible(true);
            } else if (currentScrollY <= 0) {
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

    // Helper to handle link clicks in mobile menu
    const closeAllMenus = () => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
        setShowMegaMenu(false);
    };

    const navLinks = [
        { name: 'Best Sellers', path: '/products' },
        { name: 'Products', path: '/products' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'Reach Out', path: '/reach-out' },
    ];

    return (
        <>
            {/* MOBILE NAVIGATION DRAWER */}
            <div className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeAllMenus} />
            <div className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[120] transform transition-transform duration-500 ease-out lg:hidden p-8 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Navigation</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2"><X size={20} /></button>
                </div>

                <div className="flex flex-col gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={closeAllMenus}
                            className="text-2xl font-serif text-black border-b border-gray-50 pb-4 flex justify-between items-center group"
                        >
                            {link.name}
                            <ChevronDown size={16} className="-rotate-90 text-gray-300 group-hover:text-black transition-colors" />
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-8 border-t border-gray-100 flex flex-col gap-6">
                    <Link to={user ? "/account" : "/login"} onClick={closeAllMenus} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                        <User size={18} /> {user ? 'My Profile' : 'Login / Register'}
                    </Link>
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">BoltLess © 2026</p>
                </div>
            </div>

            {/* SEARCH OVERLAY */}
            <div className={`fixed inset-0 z-[100] bg-white transition-all duration-500 ease-in-out ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12">
                    <div className="flex justify-between items-center mb-10 md:mb-20">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">Search Products</span>
                        <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-2 md:p-4 hover:rotate-90 transition-transform duration-300">
                            <X size={24} className="text-black" />
                        </button>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative group">
                            <input
                                autoFocus={isSearchOpen}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="What are you looking for?"
                                className="w-full text-2xl md:text-6xl font-serif border-b-2 border-gray-100 focus:border-black focus:outline-none pb-4 md:pb-8 transition-colors placeholder:text-gray-100 text-black"
                            />
                            {isSearching && (
                                <div className="absolute right-0 top-2 md:top-4">
                                    <Loader2 className="animate-spin text-gray-400" size={24} />
                                </div>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            {searchResults.map((product) => (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.slug}`}
                                    onClick={closeAllMenus}
                                    className="flex gap-4 md:gap-6 group items-center bg-[#F9F9F9] p-3 md:p-4 rounded-2xl md:rounded-[2rem] hover:bg-black transition-colors"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0">
                                        <img src={getImageUrl(product)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs md:text-sm font-bold text-black group-hover:text-white uppercase tracking-widest">{product.name}</h4>
                                        <p className="text-[10px] md:text-xs text-gray-400 group-hover:text-gray-300">₹{product.price.toLocaleString('en-IN')}</p>
                                    </div>
                                </Link>
                            ))}
                            {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                                <p className="text-gray-400 font-serif italic text-lg md:text-xl">No products found for "{searchQuery}"</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PROMO BAR */}
            <div className="w-full bg-[#1A1A1A] text-white text-[8px] sm:text-[10px] tracking-[0.3em] py-2.5 text-center uppercase font-bold relative z-[60]">
                {promoText}
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
                <nav className="flex items-center justify-between px-4 md:px-12 py-4 md:py-6 max-w-[1440px] mx-auto">
                    <div className="flex-1 flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <Menu
                            className="w-5 h-5 cursor-pointer lg:hidden text-black"
                            onClick={() => setIsMobileMenuOpen(true)}
                        />
                        <Search
                            className="w-5 h-5 cursor-pointer text-black hover:scale-110 transition-transform"
                            onClick={() => setIsSearchOpen(true)}
                        />
                    </div>

                    {/* STYLIZED LOGO SECTION */}
                    <div className="flex-none text-center">
                        <Link to="/" className="group flex flex-col items-center">
                            <h1 className="text-2xl md:text-4xl font-black tracking-tighter cursor-pointer text-black leading-none inline-flex items-baseline">
                                BOLT
                                <span className="text-gray-400 font-light">LESS</span>
                                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-black rounded-full ml-1 mb-1"></span>
                            </h1>
                            <span className="hidden md:block text-[8px] uppercase tracking-[0.5em] font-bold text-gray-400 mt-1 transition-all group-hover:text-black group-hover:tracking-[0.6em]">
                                Modern Furniture
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 flex justify-end items-center gap-3 md:gap-6">
                        <Link to={user ? "/account" : "/login"}>
                            <User className="w-5 h-5 cursor-pointer hidden md:block hover:text-gray-400 transition-colors text-black" />
                        </Link>
                        <div
                            onClick={() => setDrawerOpen(true)}
                            className="flex items-center gap-2 cursor-pointer group px-3 md:px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                        >
                            <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase">
                                <span className="hidden sm:inline">Cart </span>({totalItems})
                            </span>
                        </div>
                    </div>
                </nav>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center justify-center gap-10 pb-6">
                    {navLinks.map((item) => {
                        const isBestSellers = item.name === 'Best Sellers';

                        return (
                            <div
                                key={item.name}
                                className="flex items-center gap-1 cursor-pointer group py-2"
                                onMouseEnter={() => isBestSellers ? setShowMegaMenu(true) : setShowMegaMenu(false)}
                            >
                                <Link
                                    to={item.path}
                                    className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative
                                        ${isBestSellers && showMegaMenu ? 'text-black' : 'text-gray-500 hover:text-black'}
                                    `}
                                >
                                    {item.name}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full ${isBestSellers && showMegaMenu ? 'w-full' : ''}`}></span>
                                </Link>
                                {isBestSellers && (
                                    <ChevronDown size={12} className={`transition-transform text-black ${showMegaMenu ? 'rotate-180' : ''}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mega Menu Dropdown (Desktop Only) */}
                <div
                    className={`
                        absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-500 ease-in-out overflow-hidden hidden lg:block
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
                                menuProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/products/${product.slug}`}
                                        className="group cursor-pointer block"
                                        onClick={() => setShowMegaMenu(false)}
                                    >
                                        <div className="aspect-[4/5] bg-[#F9F9F9] rounded-[2rem] overflow-hidden mb-4 border border-transparent group-hover:border-gray-200 transition-all">
                                            <img
                                                src={getImageUrl(product)}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-400 mb-1 tracking-widest uppercase">₹{product.price}</p>
                                        <h4 className="text-[12px] font-bold text-black group-hover:underline underline-offset-4">{product.name}</h4>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* SPACER - Adjusted for mobile/desktop height */}
            {isScrolled && <div className="h-[80px] md:h-[140px] w-full" />}
        </>
    );
};

export default Navbar;