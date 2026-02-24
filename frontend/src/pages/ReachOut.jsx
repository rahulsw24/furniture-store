import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const ReachOut = () => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = async (data) => {
        try {
            const res = await fetch(`${API_URL}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSubmitted(true);
                reset();
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to send message.");
        }
    };

    return (
        <div className="bg-white min-h-screen">
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

            {/* --- CONTACT / SUCCESS SECTION --- */}
            <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto pb-40">
                {submitted ? (
                    /* --- FULL WIDTH SUCCESS STATE --- */
                    <div className="w-full bg-[#F9F9F9] rounded-[3rem] p-12 md:p-32 text-center animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center justify-center min-h-[500px] border border-gray-50">
                        <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-black/10">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">Message received.</h2>
                        <p className="text-gray-500 text-lg max-w-md mx-auto mb-12 leading-relaxed">
                            Thank you for reaching out. We've sent your inquiry to our team and we'll be in touch with you shortly.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link
                                to="/products"
                                className="px-10 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all"
                            >
                                Continue Shopping
                            </Link>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="px-10 py-5 bg-white border border-gray-200 text-gray-900 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:border-black transition-all"
                            >
                                Send another message
                            </button>
                        </div>
                    </div>
                ) : (
                    /* --- FORM STATE (CONSTRAINED FOR READABILITY) --- */
                    <div className="max-w-3xl">
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">
                            Drop us a line
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Name</label>
                                <input
                                    {...register("name", { required: true })}
                                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9]"
                                    placeholder="Your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Email</label>
                                <input
                                    type="email"
                                    {...register("email", { required: true })}
                                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9]"
                                    placeholder="Email address"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-900 ml-4">Message</label>
                                <textarea
                                    rows="6"
                                    {...register("message", { required: true })}
                                    className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:border-black transition-colors bg-[#F9F9F9] resize-none"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-8 px-12 py-5 bg-black text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 min-w-[200px] disabled:opacity-50 shadow-xl shadow-black/5"
                            >
                                {isSubmitting ? (
                                    <>SENDING <Loader2 size={14} className="animate-spin" /></>
                                ) : (
                                    "Submit"
                                )}
                            </button>
                        </form>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ReachOut;