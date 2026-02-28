import React from "react"
import { ChevronLeft, ScrollText } from "lucide-react"
import { Link } from "react-router-dom"

const LegalLayout = ({ title, lastUpdated, children }) => {
    return (
        <div className="bg-[#F9F9F7] min-h-screen pb-40">
            {/* --- TOP NAVIGATION BAR --- */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex justify-between items-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all group">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Return Home
                    </Link>
                    <div className="flex items-center gap-3 text-gray-300">
                        <ScrollText size={16} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">Official Policy</span>
                    </div>
                </div>
            </div>

            {/* --- HERO HEADER --- */}
            <header className="max-w-[1440px] mx-auto px-6 md:px-12 pt-24 pb-16">
                <div className="max-w-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-4">
                        <span className="w-8 h-px bg-gray-200"></span>
                        Legal Documentation
                    </p>
                    <h1 className="text-6xl md:text-8xl font-serif text-gray-900 mb-8 leading-[0.9]">
                        {title}
                    </h1>
                    <div className="flex items-center gap-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-black bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm">
                            Version 2.0
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                            Effective as of {lastUpdated}
                        </p>
                    </div>
                </div>
            </header>

            {/* --- CONTENT AREA --- */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20">

                {/* Left Sidebar (Static TOC / Branding) */}
                <aside className="hidden lg:block lg:col-span-3 space-y-10">
                    <div className="sticky top-32">
                        <div className="p-8 bg-black text-white rounded-[2.5rem] space-y-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Safety & Trust</h4>
                            <p className="text-xs leading-relaxed font-medium">
                                At BoltLess, we value transparency as much as we value precision engineering. These policies ensure a fair experience for every customer.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Text Content */}
                <main className="lg:col-span-8 lg:col-start-5">
                    <div className="bg-white rounded-[3rem] p-10 md:p-20 border border-gray-50 shadow-sm relative overflow-hidden">
                        {/* Decorative Reading Line */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-[#F3F3F1]" />

                        <div className="prose prose-gray max-w-none 
    prose-h3:text-[11px] prose-h3:uppercase prose-h3:tracking-[0.3em] prose-h3:font-black prose-h3:text-gray-900 
    prose-h3:mt-24 prose-h3:mb-10 prose-h3:pb-4 prose-h3:border-b prose-h3:border-gray-100
    prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-500 prose-p:mb-10 prose-p:font-medium
    prose-li:text-base prose-li:text-gray-500 prose-li:mb-6
    prose-strong:text-black prose-strong:font-bold">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

            {/* --- FOOTER BRANDING --- */}
            <div className="mt-40 text-center opacity-[0.03] select-none pointer-events-none">
                <h2 className="text-[15vw] font-black leading-none uppercase tracking-tighter">BoltLess</h2>
            </div>
        </div>
    )
}

export default LegalLayout