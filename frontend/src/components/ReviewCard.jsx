import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        author: 'John S.',
        rating: 5,
        quote: 'I absolutely love the simplicity of this table.',
        attribution: 'John S.'
    },
    {
        id: 2,
        author: 'Jane K.',
        rating: 5,
        quote: "I had never thought to design my own furniture. I can't believe this didn't exist before.",
        attribution: null
    },
    {
        id: 3,
        author: 'Anne L.',
        rating: 5,
        quote: 'Such a fun weekend project to work on with the kids!',
        attribution: null
    }
];

const ReviewCard = ({ review }) => (
    <div className="bg-[#F3F3F1] rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center text-center justify-center min-h-[320px]">
        {/* Author Name at Top */}
        <span className="text-sm font-bold text-gray-900 mb-4 tracking-tight">
            {review.author}
        </span>

        {/* Star Rating */}
        <div className="flex gap-1 mb-6">
            {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" className="text-black" strokeWidth={0} />
            ))}
        </div>

        {/* Review Text */}
        <p className="text-lg md:text-xl leading-relaxed text-gray-800 font-medium max-w-[280px]">
            "{review.quote}" {review.attribution && <span>— {review.attribution}</span>}
        </p>
    </div>
);

const ReviewsSection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                        Real People. Real Love.
                    </h2>
                    <button className="px-10 py-4 border border-black rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white active:scale-95">
                        Read All Reviews
                    </button>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;