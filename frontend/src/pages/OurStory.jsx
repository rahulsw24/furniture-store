import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, Hammer, Heart, Sparkles } from 'lucide-react';

const OurStory = () => {
    return (
        <div className="bg-white">
            {/* --- HERO SECTION --- */}
            <section className="py-24 md:py-40 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
                <div className="max-w-4xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">Established 2026</p>
                    <h1 className="text-6xl md:text-8xl font-serif text-gray-900 leading-[1.1] mb-12">
                        Design that fits your life, <span className="italic text-gray-400 text-5xl md:text-7xl block md:inline">not your toolbox.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-2xl">
                        We believe the furniture in your home should be an expression of freedom, not a weekend-long assembly project.
                    </p>
                </div>
            </section>

            {/* --- THE PHILOSOPHY (IMAGE + TEXT) --- */}
            <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="aspect-[4/5] bg-[#F9F9F9] rounded-[3rem] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1000&q=80"
                        alt="Minimalist Workshop"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
                    />
                </div>
                <div className="space-y-8">
                    <h2 className="text-4xl font-serif text-gray-900">The BoltLess Origin</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        BoltLess was born from a simple frustration: why does beautiful furniture have to be so difficult? We saw a world of cheap hex keys, confusing diagrams, and unstable materials.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        We decided to strip everything away. No bolts. No screws. No stress. Just precision-engineered joinery and the finest Baltic Birch Plywood on the planet.
                    </p>
                    <div className="pt-8 grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-3xl font-serif text-black mb-2">2 min</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Average Assembly Time</p>
                        </div>
                        <div>
                            <p className="text-3xl font-serif text-black mb-2">0</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tools Required</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- OUR MATERIALS SECTION --- */}
            <section className="bg-[#F9F9F9] rounded-[4rem] mx-6 md:mx-12 py-32 px-6 md:px-12 text-center overflow-hidden relative">
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-sm text-black">
                        <Trees size={32} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">Honest Materials.</h2>
                    <p className="text-xl text-gray-600 leading-relaxed mb-12">
                        We use 13-ply premium Baltic Birch. It is incredibly strong, warp-resistant, and features a beautiful exposed edge that celebrates the natural layering of the wood.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">Sustainably Sourced</span>
                        <span className="px-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">Zero Plastic</span>
                        <span className="px-6 py-3 bg-white border border-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500">VOC-Free Finish</span>
                    </div>
                </div>
                {/* Decorative side text */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -rotate-90 text-[120px] font-black text-black/[0.02] whitespace-nowrap pointer-events-none select-none">
                    BALTIC BIRCH
                </div>
            </section>

            {/* --- VALUES GRID --- */}
            <section className="py-32 px-6 md:px-12 max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <ValueBlock
                        icon={<Hammer size={24} />}
                        title="Smart Engineering"
                        desc="Our tension-fit joints get stronger the more you use the furniture. It’s science, styled."
                    />
                    <ValueBlock
                        icon={<Heart size={24} />}
                        title="Made to Last"
                        desc="Unlike flat-pack disposables, BoltLess is designed to move with you through every chapter of life."
                    />
                    <ValueBlock
                        icon={<Sparkles size={24} />}
                        title="Finished by You"
                        desc="Every piece arrives sanded and ready. Keep it raw, wax it, or paint it—the final design is yours."
                    />
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 text-center border-t border-gray-100">
                <h2 className="text-3xl font-serif mb-10">Experience the future of furniture.</h2>
                <Link to="/products" className="inline-block bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                    Browse the Collection
                </Link>
            </section>
        </div>
    );
};

const ValueBlock = ({ icon, title, desc }) => (
    <div className="p-10 rounded-[2.5rem] border border-gray-50 hover:border-black transition-all group">
        <div className="w-12 h-12 rounded-2xl bg-[#F9F9F9] flex items-center justify-center text-gray-400 mb-8 group-hover:bg-black group-hover:text-white transition-all">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default OurStory;