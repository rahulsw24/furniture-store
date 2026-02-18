import React, { useRef, useState } from 'react';

const products = [
    { id: 1, title: 'Mini Rocker', price: '$79', img: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=400&auto=format&fit=crop' },
    { id: 2, title: 'Modern Shelf', price: '$99', img: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?q=80&w=400&auto=format&fit=crop' },
    { id: 3, title: 'Side Table', price: '$59', oldPrice: '$198', discount: '-70%', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=400&auto=format&fit=crop' },
    { id: 4, title: 'Modern Shelf', price: '$99', img: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=400&auto=format&fit=crop' },
    { id: 5, title: 'Round Coffee Table', price: '$119', img: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=400&auto=format&fit=crop' },
    { id: 6, title: 'Wall Shelves', price: '$49', img: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=400&auto=format&fit=crop' },
];

const VideoCarousel = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse Drag Logic
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto text-center mb-10 px-6">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-2">Beautiful Furniture in Seconds</h2>
                <p className="text-gray-500 text-sm md:text-base">
                    Assemble in <span className="font-bold text-gray-900">seconds</span> and enjoy the rest of your day.
                </p>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`
          flex gap-4 px-6 md:px-12 overflow-x-auto pb-10 cursor-grab active:cursor-grabbing
          scrollbar-hide snap-x snap-mandatory select-none
        `}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Fallback for Firefox/IE
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="relative min-w-[220px] md:min-w-[240px] aspect-[9/14] rounded-2xl overflow-hidden shadow-sm snap-start group"
                    >
                        {/* Background Image */}
                        <img
                            src={product.img}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            draggable="false"
                        />

                        {/* Overlay for depth */}
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />

                        {/* Top Badge */}
                        {product.discount && (
                            <div className="absolute top-4 left-4 bg-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                {product.discount}
                            </div>
                        )}

                        {/* Subtle Play Icon */}
                        <div className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-1.5 rounded-full opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <PlayIcon className="w-3.5 h-3.5 text-white" />
                        </div>

                        {/* Bottom Info Bar - Adjusted to match original scale */}
                        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between shadow-lg translate-y-1 group-hover:translate-y-0 transition-transform">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={product.img} alt="thumb" className="w-full h-full object-cover" />
                                </div>
                                <div className="leading-tight">
                                    <h3 className="text-[12px] font-bold text-gray-800 truncate w-24">{product.title}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[12px] text-gray-600 font-medium">{product.price}</span>
                                        {product.oldPrice && (
                                            <span className="text-[10px] text-gray-400 line-through">{product.oldPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline styles to hide scrollbar across all browsers */}
            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </section>
    );
};

const PlayIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M8 5v14l11-7z" />
    </svg>
);

export default VideoCarousel;