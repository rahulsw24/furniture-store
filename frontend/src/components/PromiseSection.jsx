import React from 'react';
import { Heart, Truck, Star, Wrench } from 'lucide-react';

const promises = [
    {
        id: 1,
        icon: <Heart size={40} strokeWidth={1} className="text-black" />,
        title: 'High Quality Materials',
        description: 'Our furniture is made with top-of-the-line materials.',
    },
    {
        id: 2,
        icon: <Truck size={40} strokeWidth={1} className="text-black" />,
        title: 'Fast Shipping',
        description: 'We get all orders out within 1-3 business days.',
    },
    {
        id: 3,
        icon: <NoToolIcon />,
        title: 'No Tool Assembly',
        description: 'All or our product assembly fast and easy with no tools required.',
    },
    {
        id: 4,
        icon: <Star size={40} strokeWidth={1} className="text-black" />,
        title: 'Made in the USA',
        // Note: I reverted "India" back to "USA" to match the screenshot text exactly as well
        description: 'All of our products are designed and crafted in our California studio.',
    },
];

// Custom Icon for "No Tools"
function NoToolIcon() {
    return (
        <div className="relative flex items-center justify-center w-10 h-10">
            <Wrench size={32} strokeWidth={1} className="text-black" />
            <div className="absolute w-[120%] h-[1px] bg-black rotate-[-45deg]" />
            <div className="absolute inset-0 border border-black rounded-full scale-110" />
        </div>
    );
}

const PromiseSection = () => {
    return (
        <section className="py-24 bg-white px-6">
            <div className="max-w-[1440px] mx-auto">
                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-16">
                    Our Promise to You
                </h2>

                {/* Grid Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {promises.map((item) => (
                        <div
                            key={item.id}
                            // UPDATED LINE: Changed bg to white and added a subtle border
                            className="bg-white border border-[#F3F3F1] rounded-[2.5rem] p-10 flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-1"
                        >
                            {/* Icon Wrapper */}
                            <div className="mb-8 h-12 flex items-center justify-center">
                                {item.icon}
                            </div>

                            {/* Text Content */}
                            <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromiseSection;