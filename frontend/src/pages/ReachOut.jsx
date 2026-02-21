import React from 'react';

const ReachOut = () => {
    return (
        <div className="bg-white">
            {/* --- HERO SECTION --- */}
            <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto border-b border-gray-100">
                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-8">
                        Reach out
                    </h1>

                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                        <p>
                            Our team is always on hand to help, we aim to get to you as soon as we can within office hours, Monday - Friday 9-5pm PST.
                        </p>
                        <p>
                            Have a question? Hit us up and we'll get back to you within 24 hours (or sooner).
                        </p>
                    </div>
                </div>
            </section>

            {/* --- CONTACT FORM SECTION --- */}
            <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto pb-40">
                <div className="max-w-3xl">
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">
                        Drop us a line
                    </h2>

                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9]"
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9]"
                                placeholder="Email address"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Message</label>
                            <textarea
                                id="message"
                                rows="6"
                                className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9] resize-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 px-12 py-5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all transform active:scale-[0.98]"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ReachOut;