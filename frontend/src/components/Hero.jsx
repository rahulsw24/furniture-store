import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ChevronDown, ArrowRight, User } from 'lucide-react';

const dropdownProducts = [
    { id: 1, name: 'Modern Shelf', price: 'From $99.00', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=300' },
    { id: 2, name: 'Side Table', price: 'On Sale from $59.00', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=300' },
    { id: 3, name: 'Wall Shelves', price: 'From $49.00', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300' },
    { id: 4, name: 'Monitor Stand', price: 'From $79.00', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=300' },
    { id: 5, name: 'Round Coffee Table', price: 'From $119.00', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=300' },
    { id: 6, name: 'Mini Side Table', price: 'On Sale from $39.00', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=300' },
];

const Hero = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMegaMenu, setShowMegaMenu] = useState(false);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 50);
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setShowMegaMenu(false); // Close menu on scroll
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

    return (
        <div className="w-full relative">
            <div className="w-full bg-[#E5DACE] text-black text-[10px] sm:text-[11px] tracking-[0.2em] py-2.5 text-center uppercase font-medium">
                PRESIDENTS DAY SALE: 15% OFF + FREE SHIPPING
            </div>

            <header
                className={`
                    left-0 right-0 w-full z-50 transition-all duration-500 ease-in-out bg-white
                    ${isScrolled ? 'fixed shadow-sm' : 'relative'}
                    ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                `}
                style={{ top: isScrolled ? '0' : 'auto' }}
                onMouseLeave={() => setShowMegaMenu(false)}
            >
                <nav className="flex items-center justify-between px-6 py-5 md:px-12">
                    <div className="flex-1">
                        <Search className="w-5 h-5 cursor-pointer text-black hover:opacity-60 transition" />
                    </div>
                    <div className="flex-none">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer uppercase">UNFNSHED</h1>
                    </div>
                    <div className="flex-1 flex justify-end items-center gap-5">
                        <User className="w-5 h-5 cursor-pointer hidden md:block hover:opacity-60 transition" />
                        <div className="flex items-center gap-1 cursor-pointer group">
                            <ShoppingBag className="w-5 h-5 group-hover:opacity-60 transition" />
                            <span className="text-xs font-medium">(0)</span>
                        </div>
                    </div>
                </nav>

                <div className="hidden lg:flex items-center justify-center gap-8 pb-4">
                    {['Best Sellers', 'Bundle and Save', 'Products', 'Favorite Finishes', 'Tutorials', 'How to Assemble', 'Our Story', 'Reach out'].map((item) => (
                        <div
                            key={item}
                            className="flex items-center gap-1 cursor-pointer group py-2"
                            onMouseEnter={() => item === 'Best Sellers' ? setShowMegaMenu(true) : setShowMegaMenu(false)}
                        >
                            <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${item === 'Best Sellers' && showMegaMenu ? 'text-gray-400 underline underline-offset-8' : 'text-black group-hover:text-gray-500'}`}>
                                {item}
                            </span>
                            {(item === 'Best Sellers' || item === 'Bundle and Save') && (
                                <ChevronDown className={`w-3 h-3 transition-transform ${item === 'Best Sellers' && showMegaMenu ? 'rotate-180' : ''}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* --- MEGA MENU DROPDOWN --- */}
                <div
                    className={`
                        absolute top-full left-0 w-full bg-white border-b border-gray-100 transition-all duration-300 ease-out overflow-hidden
                        ${showMegaMenu ? 'opacity-100 visible max-h-[500px]' : 'opacity-0 invisible max-h-0'}
                    `}
                >
                    <div className="max-w-[1440px] mx-auto px-12 py-10">
                        <div className="grid grid-cols-6 gap-6">
                            {dropdownProducts.map((product) => (
                                <div key={product.id} className="group cursor-pointer">
                                    <div className="aspect-square bg-[#F3F3F1] rounded-2xl overflow-hidden mb-3">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <p className="text-[11px] text-gray-500 mb-1">{product.price}</p>
                                    <h4 className="text-[13px] font-bold text-black">{product.name}</h4>
                                </div>
                            ))}
                        </div>
                        <button className="mt-10 px-8 py-3 border border-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                            Shop All
                        </button>
                    </div>
                </div>
            </header>

            <section className="relative w-full h-[85vh] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1600" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/35" />
                <div className="absolute inset-0 flex items-center px-6 md:px-20 lg:px-32">
                    <div className="max-w-3xl">
                        <h2 className="text-white text-5xl md:text-7xl lg:text-[88px] font-serif leading-[0.95] mb-8">Modern Furniture.<br />2-Minute Assembly.</h2>
                        <button className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
                            Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Hero;