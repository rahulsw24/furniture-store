import React from 'react';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative w-full h-[85vh] overflow-hidden">
            {/* Background Image */}
            <img
                src="https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1600"
                alt="Modern Desk Setup"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-black/35" />

            {/* Text Overlay */}
            <div className="absolute inset-0 flex items-center px-6 md:px-20 lg:px-32">
                <div className="max-w-3xl">
                    {/* Rating Badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex gap-0.5 text-[#FFB800]">
                            {[...Array(5)].map((_, i) => <span key={i} className="text-sm">★</span>)}
                        </div>
                        <span className="text-[10px] tracking-[0.15em] font-bold uppercase text-white/90">
                            15,000+ Happy Customers
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-white text-5xl md:text-7xl lg:text-[88px] font-serif leading-[0.95] mb-8 drop-shadow-lg">
                        Modern Furniture.<br />
                        2-Minute Assembly.
                    </h2>

                    {/* Sub-description */}
                    <p className="max-w-md text-white/90 text-sm md:text-base mb-10 leading-relaxed font-medium">
                        Premium furniture-grade plywood, tool-free design.
                        Built to last, finished by you.
                    </p>

                    {/* Action Button */}
                    <button className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] font-bold shadow-2xl hover:bg-black hover:text-white transition-all duration-500 transform hover:scale-105">
                        Shop Collection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;