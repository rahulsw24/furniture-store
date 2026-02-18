import React from 'react';
import { Star } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'Rectangle Coffee Table',
        price: '$119.00',
        // Minimalist Oak Coffee Table
        image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800',
        badge: 'New',
        rating: 5,
        reviews: null,
    },
    {
        id: 2,
        name: 'Modular Shelf',
        price: '$139.00',
        // Plywood Modular shelving
        image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800',
        rating: 5,
        reviews: 5,
    },
    {
        id: 3,
        name: 'Modern Shelf',
        price: 'From $99.00',
        // Leaning Ladder Shelf
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=800',
        rating: 5,
        reviews: 326,
    },
    {
        id: 4,
        name: 'Wall Shelves',
        price: 'From $49.00',
        // Floating Wooden Shelves
        image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800',
        rating: 5,
        reviews: 146,
    },
    {
        id: 5,
        name: 'Side Table',
        price: 'On Sale from $59.00',
        // Round bedside/side table
        image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800',
        badge: 'Save up to $29.00',
        rating: 5,
        reviews: 162,
    },
    {
        id: 6,
        name: 'Modern Console Table',
        price: '$179.00',
        // Sleek entryway console
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=800',
        badge: 'New',
        rating: 5,
        reviews: 3,
    },
    {
        id: 7,
        name: 'Mini Side Table',
        price: 'On Sale from $39.00',
        // Small minimalist stool/table
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
        badge: 'Save $9.00',
        rating: 5,
        reviews: 44,
    },
    {
        id: 8,
        name: 'Record / Book Holder',
        price: '$39.00',
        // Vinyl record storage
        image: 'https://images.unsplash.com/photo-1603001901798-e92b3a33f089?auto=format&fit=crop&q=80&w=800',
        rating: 5,
        reviews: 44,
    }
];

const ProductCard = ({ product }) => (
    <div className="group cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#F3F3F1] mb-4">
            <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                loading="lazy"
            />
            {product.badge && (
                <span className={`absolute top-4 right-4 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm z-10 ${product.badge.includes('Save') ? 'bg-black text-white' : 'bg-white text-black'
                    }`}>
                    {product.badge}
                </span>
            )}
        </div>

        <div className="space-y-1 px-1">
            <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
            <div className="flex items-center gap-1">
                <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                    ))}
                </div>
                {product.reviews && (
                    <span className="text-[11px] text-gray-500 font-medium">{product.reviews} reviews</span>
                )}
            </div>
            <p className="text-[15px] font-medium text-gray-700">{product.price}</p>
        </div>
    </div>
);

const ProductGrid = () => {
    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-[1440px] mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-serif mb-12 text-gray-900">Best Sellers</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <button className="inline-block px-12 py-4 border border-black rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-black hover:text-white active:scale-95">
                    View all products
                </button>
            </div>
        </section>
    );
};

export default ProductGrid;