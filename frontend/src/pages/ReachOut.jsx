import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, CheckCircle2, MapPin, Phone, Mail, Clock } from 'lucide-react';
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
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6">Connect with us</p>
                    <h1 className="text-5xl md:text-8xl font-serif text-gray-900 mb-8 leading-none">
                        Reach <span className="italic text-gray-300">out.</span>
                    </h1>
                    <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                        Whether you're looking for a custom sized dining table or just want to chat about wood finishes, our team is ready to help.
                    </p>
                </div>
            </section>

            {/* --- CONTENT SECTION --- */}
            <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto pb-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                    {/* LEFT: FORM */}
                    <div className="lg:col-span-7">
                        {submitted ? (
                            <div className="bg-[#F9F9F7] rounded-[3rem] p-12 md:p-24 text-center animate-in zoom-in-95 fade-in duration-700 border border-gray-50">
                                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-8 mx-auto">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h2 className="text-3xl font-serif mb-4 text-gray-900">Message received.</h2>
                                <p className="text-gray-500 mb-10 leading-relaxed">We'll get back to you within 24 hours.</p>
                                <button onClick={() => setSubmitted(false)} className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-8">Send another</button>
                            </div>
                        ) : (
                            <div className="max-w-2xl">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-12">Inquiry Form</h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900 ml-1">Your Name</label>
                                            <input {...register("name", { required: true })} className="w-full px-0 py-4 border-b border-gray-200 focus:border-black transition-colors bg-transparent outline-none text-sm" placeholder="Your Name..." />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900 ml-1">Email Address</label>
                                            <input type="email" {...register("email", { required: true })} className="w-full px-0 py-4 border-b border-gray-200 focus:border-black transition-colors bg-transparent outline-none text-sm" placeholder="email@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-900 ml-1">Your Message</label>
                                        <textarea rows="4" {...register("message", { required: true })} className="w-full px-0 py-4 border-b border-gray-200 focus:border-black transition-colors bg-transparent outline-none text-sm resize-none" placeholder="How can we help you?" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-12 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Sending</> : "Send Message"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: COMPLIANCE DETAILS (RAZORPAY REQUIREMENT) */}
                    <div className="lg:col-span-5 space-y-16">
                        <div>
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-10">Studio Details</h2>
                            <div className="space-y-12">
                                <ContactDetail
                                    icon={<MapPin size={18} />}
                                    title="Physical Address"
                                    content={<>Near Telephone Exchange,<br />JK Complex Shop No.2,<br /> Uttarakhand, Roorkee, 247667</>}
                                />
                                <ContactDetail
                                    icon={<Phone size={18} />}
                                    title="Support Line"
                                    content="+91 70788 51958"
                                />
                                <ContactDetail
                                    icon={<Mail size={18} />}
                                    title="Email Support"
                                    content="support@boltless.in"
                                />
                                <ContactDetail
                                    icon={<Clock size={18} />}
                                    title="Working Hours"
                                    content="Mon — Sun, 9am — 6pm IST"
                                />
                            </div>
                        </div>

                        {/* Subtle Map Placeholder / Visual */}
                        {/* Real Google Maps Embed */}
                        {/* Real Google Maps Embed */}
                        <div className="h-64 w-full bg-[#F9F9F7] rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm group relative">
                            <iframe
                                title="BoltLess Studio Location"
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3076.746889521202!2d77.89065177554727!3d29.87433817500979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjnCsDUyJzI3LjYiTiA3N8KwNTMnMzUuNiJF!5e1!3m2!1sen!2sin!4v1772287919422!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{
                                    border: 0,
                                    filter: 'grayscale(1) contrast(1.2) opacity(0.9)',
                                }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:filter-none transition-all duration-700"
                            />
                            {/* Subtle internal border to ensure rounded corners look perfect */}
                            <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[2.5rem]"></div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

/* --- HELPER COMPONENT --- */
const ContactDetail = ({ icon, title, content }) => (
    <div className="flex gap-6">
        <div className="w-12 h-12 rounded-2xl bg-[#F9F9F7] flex items-center justify-center text-gray-400 flex-shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-2">{title}</h4>
            <div className="text-sm text-gray-500 leading-relaxed">{content}</div>
        </div>
    </div>
);

export default ReachOut;