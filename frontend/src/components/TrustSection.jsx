import React from 'react';
import { ExternalLink, ShieldCheck, Truck, Star } from 'lucide-react';

const TrustSection = () => {
    return (
        <section className="bg-[#F9F9F7] py-10 md:py-14 border-y border-gray-100">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">

                    {/* LEFT: AMAZON BRANDING */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Find us on</span>
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                alt="Amazon"
                                className="h-5 opacity-80"
                            />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif text-black leading-tight">
                            Same quality, <br className="hidden md:block" /> available where you trust.
                        </h2>
                        <a
                            href="https://www.amazon.in/storefront?me=A2D7A07YPM1491&ref_=ssf_share" // Replace with your actual store link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black hover:opacity-60 transition-all underline underline-offset-8 decoration-gray-200"
                        >
                            Shop BoltLess on Amazon <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                    {/* RIGHT: TRUST PILLARS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 w-full lg:w-auto">
                        <TrustPillar
                            icon={<Star size={16} />}
                            title="Top Rated"
                            desc="Consistently 4.5+ stars on Amazon India."
                        />
                        <TrustPillar
                            icon={<Truck size={16} />}
                            title="Prime Delivery"
                            desc="Fast, secure fulfillment across the country."
                        />
                        <TrustPillar
                            icon={<ShieldCheck size={16} />}
                            title="Verified Buying"
                            desc="Authentic reviews from real Indian homes."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

const TrustPillar = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-black shadow-sm">
            {icon}
        </div>
        <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black mb-1">{title}</h4>
            <p className="text-[11px] leading-relaxed text-gray-400 max-w-[150px]">{desc}</p>
        </div>
    </div>
);

export default TrustSection;