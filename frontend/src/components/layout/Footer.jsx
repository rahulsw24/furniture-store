import React from 'react';
import { Link } from 'react-router-dom';
import {
    Instagram,
    ArrowUp,
    // Facebook,
    // Youtube,
    // Twitter
} from 'lucide-react';

// Custom SVG Icons for Pinterest and TikTok (keeping these as they are high-engagement for furniture)
const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.289 2C6.617 2 2 6.617 2 12.289c0 4.305 2.654 8.01 6.385 9.549-.096-.78-.182-1.97.039-2.82.193-.73 1.258-5.32 1.258-5.32s-.321-.643-.321-1.594c0-1.493.864-2.607 1.94-2.607.915 0 1.358.687 1.358 1.512 0 .92-.586 2.296-.887 3.57-.252 1.068.539 1.938 1.589 1.938 1.907 0 3.375-2.01 3.375-4.915 0-2.57-1.844-4.364-4.482-4.364-3.056 0-4.85 2.292-4.85 4.662 0 .924.356 1.914.8 2.454.088.106.101.199.075.308-.082.34-.264 1.072-.3 1.216-.047.19-.155.23-.358.137-1.334-.62-2.17-2.56-2.17-4.118 0-3.354 2.436-6.433 7.025-6.433 3.688 0 6.554 2.63 6.554 6.14 0 3.666-2.31 6.617-5.515 6.617-1.077 0-2.09-.56-2.437-1.223 0 0-.533 2.025-.662 2.527-.24.918-.887 2.07-1.32 2.777 1.004.309 2.067.476 3.17.476 5.671 0 10.288-4.617 10.288-10.289C22.578 6.617 17.96 2 12.289 2z" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-3.3 2.97-6.07 6.26-6.02 1.37.06 2.73.57 3.84 1.39v4.14c-.67-.39-1.44-.6-2.22-.61-1.77-.05-3.41 1.45-3.51 3.21-.05.5.01 1 .15 1.48.34 1.25 1.54 2.15 2.84 2.14 1.07-.02 2.08-.63 2.61-1.57.26-.45.38-.97.37-1.5-.03-4.77-.01-9.53-.02-14.3z" />
    </svg>
);

const Footer = () => {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const navLinks = [
        { name: 'Products', path: '/products' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'Reach out', path: '/reach-out' }
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
                        {/* Commented out as requested */}
                        {/* <Facebook size={18} className="cursor-pointer hover:text-gray-400" strokeWidth={1.5} /> */}

                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            <Instagram size={18} className="cursor-pointer hover:text-gray-400" strokeWidth={1.5} />
                        </a>
                        {/* 
                        <div className="cursor-pointer hover:text-gray-400"><PinterestIcon /></div>
                        <div className="cursor-pointer hover:text-gray-400"><TikTokIcon /></div> */}

                        {/* Commented out as requested */}
                        {/* <Twitter size={18} className="cursor-pointer hover:text-gray-400" strokeWidth={1.5} /> */}
                        {/* <Youtube size={20} className="cursor-pointer hover:text-gray-400" strokeWidth={1.5} /> */}
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
                        <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms</Link>
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