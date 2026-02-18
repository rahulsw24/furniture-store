import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
    {
        question: "What are your products made from?",
        answer: "All of our products are made from sustainably sourced furniture-grade birch, an incredibly strong and high quality plywood."
    },
    {
        question: "What kinds of finishes can I put on?",
        answer: "You can use wax, oil, or water-based polyurethane. We recommend testing a small area first to see how the wood reacts."
    },
    {
        question: "What if I make a mistake. Can I redo it?",
        answer: "Absolutely. Our modular design allows you to disassemble and reassemble pieces easily if you need to make adjustments."
    },
    {
        question: "How easy is it to assemble your products?",
        answer: "Most pieces snap together in seconds. No tools, no screws, and no headache required."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day trial period. If you don't love it, we'll help you with a return or exchange."
    }
];

const InstagramStrip = () => (
    <section className="py-20 bg-[#F3F3F1] text-center px-6">
        <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif text-[#0033FF] font-bold mb-4">
                Follow us on Instagram
            </h2>
            <p className="text-gray-900 font-medium mb-10">
                Have a quick question? Ping us on IG and we'll get back to you ASAP.
            </p>
            <button className="bg-black text-white px-10 py-4 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95">
                Join us on Instagram
            </button>
        </div>
    </section>
);

const AccordionItem = ({ item, isOpen, onClick }) => (
    <div className="border-b border-gray-100">
        <button
            className="w-full py-7 flex items-start gap-4 text-left group transition-all"
            onClick={onClick}
        >
            {/* Icon on the Left */}
            <div className="mt-1 text-gray-900 flex-shrink-0">
                {isOpen ? (
                    <Minus size={18} strokeWidth={1.5} />
                ) : (
                    <Plus size={18} strokeWidth={1.5} />
                )}
            </div>

            <span className="text-lg font-bold text-gray-900 tracking-tight">
                {item.question}
            </span>
        </button>

        {/* Indented Answer */}
        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-64 pb-8' : 'max-h-0'
                }`}
        >
            <div className="pl-9"> {/* Padding to align text with the question, not the icon */}
                <p className="text-[17px] text-gray-800 leading-relaxed max-w-4xl">
                    {item.answer}
                </p>
            </div>
        </div>
    </div>
);

const FAQSection = () => {
    // Opening the first item by default to match your screenshot
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-28 bg-white px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Got questions?
                    </h2>
                    <p className="text-gray-500 text-lg lowercase italic">
                        Here's some answers
                    </p>
                </div>

                {/* Accordion List */}
                <div className="border-t border-gray-100">
                    {faqData.map((item, index) => (
                        <AccordionItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CombinedSections = () => (
    <>
        <InstagramStrip />
        <FAQSection />
    </>
);

export default CombinedSections;