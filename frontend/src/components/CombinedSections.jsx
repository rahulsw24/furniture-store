import React, { useState } from 'react';
import { Plus, Minus, Instagram, ExternalLink, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';


const faqData = [
    {
        question: "What are BoltLess products made from?",
        answer: "We use premium, sustainably sourced solid timbers and high-grade birch cores. Every piece is selected for its grain pattern and structural integrity, ensuring it lasts for generations."
    },
    {
        question: "Do I need tools for assembly?",
        answer: "No. Our precision-engineered 'BoltLess' joinery system is designed to snap together with satisfying clicks. No screws, no hex keys, and no frustration required."
    },
    {
        question: "Can I apply my own wood finish?",
        answer: "While our pieces come pre-finished with a protective matte coat, you can request raw timber if you'd like to apply your own oils or waxes. We recommend testing a small hidden area first."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 7-day return window for standard catalog items. The piece must be in its original, unassembled condition and packaging. Please note that custom commissions are final sale."
    },
    {
        question: "How do you handle shipping?",
        answer: "Shipping is included in our all-in pricing. We use specialized furniture couriers to ensure your piece arrives in pristine condition within 10-15 business days."
    }
];

const InstagramStrip = () => (
    <section className="py-32 bg-[#F3F3F1] text-center px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
            {/* --- TOP LABEL --- */}
            <div className="flex items-center justify-center gap-3 mb-8 text-gray-400">
                <Instagram size={16} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Digital Studio</span>
            </div>

            {/* --- MAIN HEADER --- */}
            <h2 className="text-5xl md:text-8xl font-serif text-gray-900 mb-8 leading-none tracking-tight">
                Follow <span className="italic text-gray-400">@boltless.in</span>
            </h2>

            {/* --- DESCRIPTION --- */}
            <p className="text-gray-500 text-sm md:text-base font-medium mb-12 max-w-lg mx-auto leading-relaxed">
                Have a quick question about a build or finish? <br className="hidden md:block" />
                DM us on Instagram for a direct line to our design team.
            </p>

            {/* --- CTA BUTTON --- */}
            <a
                href="https://www.instagram.com/boltless.in"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] transition-all hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-xl shadow-black/5 group"
            >
                View Profile
                <ExternalLink size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
            </a>
        </div>

        {/* --- DECORATIVE WATERMARK --- */}
        <div className="absolute -bottom-10 -right-10 opacity-[0.02] select-none pointer-events-none">
            <h2 className="text-[25vw] font-black leading-none uppercase tracking-tighter">IG</h2>
        </div>
    </section>
);

const AccordionItem = ({ item, index, isOpen, onClick }) => (
    <div className={`border-b border-gray-100 transition-all duration-500 ${isOpen ? 'bg-[#F9F9F7]/50' : 'bg-transparent'}`}>
        <button
            className="w-full py-10 flex items-center justify-between gap-8 text-left group px-4"
            onClick={onClick}
        >
            <div className="flex items-center gap-8">
                <span className="text-[10px] font-bold text-gray-300 font-serif italic">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-black' : 'text-gray-700'}`}>
                    {item.question}
                </span>
            </div>

            <div className={`flex-shrink-0 w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-black text-white border-black rotate-180' : 'bg-white text-gray-900'}`}>
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
            </div>
        </button>

        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-12' : 'max-h-0 opacity-0'}`}
        >
            <div className="pl-20 pr-12">
                <p className="text-base text-gray-500 leading-relaxed max-w-3xl font-medium">
                    {item.answer}
                </p>
            </div>
        </div>
    </div>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-32 bg-white px-6 relative">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="max-w-xl">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                            <span className="w-8 h-px bg-gray-200"></span>
                            Information
                        </p>
                        <h2 className="text-5xl md:text-7xl font-serif text-gray-900 leading-none">
                            Common <span className="italic text-gray-300">Queries.</span>
                        </h2>
                    </div>
                    <div className="pb-2">
                        <p className="text-gray-400 text-sm font-medium italic max-w-[200px] leading-relaxed">
                            Everything you need to know about our precision process.
                        </p>
                    </div>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-900/5">
                    {faqData.map((item, index) => (
                        <AccordionItem
                            key={index}
                            index={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>

                {/* Bottom Support Link */}
                <div className="mt-20 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Still have a specific question?</p>
                    <Link to="/reach-out" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] group">
                        <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                        Contact Support
                    </Link>
                </div>
            </div>
        </section>
    );
};

const CombinedSections = () => (
    <div className="bg-white">
        <InstagramStrip />
        <FAQSection />
    </div>
);

export default CombinedSections;