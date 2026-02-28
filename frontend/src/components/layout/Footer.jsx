import React from 'react';
import { Link } from 'react-router-dom';
import {
    Instagram,
    ArrowUp,
} from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const navLinks = [
        { name: 'Products', path: '/products' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'Reach out', path: '/reach-out' },
        { name: 'Refunds', path: '/refund-policy' }
    ];

    return (
        <footer className="bg-black text-white pt-20 pb-12 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-24 mb-20 relative z-10">

                {/* Column 1: NAVIGATION */}
                <div>
                    <h4 className="text-[11px] font-bold tracking-[0.25em] mb-10 text-white uppercase">Navigation</h4>
                    <ul className="space-y-4">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} className="text-[14px] text-gray-400 hover:text-white hover:underline underline-offset-8 transition-all">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2: Follow us */}
                <div>
                    <h4 className="text-[15px] font-bold mb-6 text-white uppercase tracking-widest">Connect</h4>
                    <p className="text-gray-400 text-[14px] mb-8 max-w-[280px] leading-relaxed">
                        Join our community for simplified living inspiration and updates.
                    </p>
                    <div className="flex gap-6 items-center text-white">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <Instagram size={18} className="cursor-pointer hover:text-gray-400" strokeWidth={1.5} />
                        </a>
                    </div>
                </div>

                {/* Column 3: Brand Identity */}
                <div className="flex flex-col justify-start">
                    <h1 className="text-3xl font-black tracking-tighter text-white leading-none inline-flex items-baseline mb-4">
                        BOLT
                        <span className="text-gray-600 font-light uppercase">less</span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full ml-1 mb-1"></span>
                    </h1>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.3em] leading-relaxed">
                        Modern Furniture<br />Precision Engineered
                    </p>
                </div>
            </div>

            {/* Bottom Copyright Row */}
            <div className="max-w-[1440px] mx-auto pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Copyright © 2026 BOLTLESS FURNITURE.
                    </p>
                    <div className="flex gap-8 text-[9px] font-bold uppercase tracking-widest text-gray-600">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
                        <Link to="/reach-out" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </div>

            {/* Floating Scroll to Top */}
            <button
                onClick={scrollToTop}
                className="absolute bottom-12 right-6 md:right-12 flex flex-col items-center gap-2 group z-20"
            >
                <div className="w-11 h-11 rounded-full border border-gray-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <ArrowUp size={18} />
                </div>
                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase group-hover:text-white transition-colors">TOP</span>
            </button>
        </footer>
    );
};

export default Footer;