import React, { useState } from 'react';
import { Loader2, CheckCircle2, Mail, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [message, setMessage] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");

        try {
            const res = await fetch(`${API_URL}/api/subscribers`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
                setMessage("You've been added to our private list.");
            } else {
                const data = await res.json();
                setStatus("error");
                setMessage(data.errors?.[0]?.message || "This email is already subscribed.");
            }
        } catch (err) {
            setStatus("error");
            setMessage("Connection failed. Please try again later.");
        }
    };

    return (
        <section className="py-32 bg-[#F3F3F1] px-6 text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">

                {status === "success" ? (
                    <div className="animate-in zoom-in-95 fade-in duration-700">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl shadow-black/10">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-4xl font-serif text-gray-900 mb-4 italic">Welcome aboard.</h2>
                        <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">{message}</p>
                        <button
                            onClick={() => setStatus("idle")}
                            className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all underline underline-offset-8"
                        >
                            Subscribe another email
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-8 text-black/10">
                            <Mail size={48} strokeWidth={1} />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-none tracking-tight">
                            Stay in <span className="italic">the loop.</span>
                        </h2>

                        <p className="text-gray-500 text-sm mb-12 max-w-md mx-auto leading-relaxed font-medium">
                            Join our community for early access to new collections, precision-engineered tutorials, and studio updates.
                        </p>

                        <form onSubmit={handleSubscribe} className="relative max-w-lg mx-auto">
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    disabled={status === "loading"}
                                    className="px-8 py-5 w-full rounded-2xl border border-transparent focus:outline-none focus:ring-1 focus:ring-black transition-all bg-white text-sm placeholder:text-gray-300 disabled:opacity-50 shadow-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-[10px] tracking-[0.25em] hover:bg-gray-800 transition-all uppercase flex items-center justify-center min-w-[160px] disabled:bg-gray-400 shadow-lg shadow-black/5"
                                >
                                    {status === "loading" ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        "Join Now"
                                    )}
                                </button>
                            </div>

                            {status === "error" && (
                                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-6 animate-in fade-in slide-in-from-top-2">
                                    {message}
                                </p>
                            )}
                        </form>

                        <div className="mt-12 flex items-center justify-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            <Sparkles size={12} className="text-orange-400" />
                            No Spam. Only Woodworking & Precision.
                        </div>
                    </>
                )}
            </div>

            {/* Subtle brand watermark */}
            <div className="absolute -bottom-10 -left-10 opacity-[0.02] select-none pointer-events-none">
                <h2 className="text-[20vw] font-black leading-none uppercase tracking-tighter">Bolt</h2>
            </div>
        </section>
    );
};

export default function PageEnd() {
    return (
        <>
            <Newsletter />
        </>
    );
}