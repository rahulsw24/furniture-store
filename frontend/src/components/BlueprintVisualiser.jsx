import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Maximize, Ruler } from 'lucide-react';

const BlueprintVisualizer = ({ dimensionsText }) => {
    const [unit, setUnit] = useState('in');

    const specs = useMemo(() => {
        if (!dimensionsText) return null;
        const extract = (label) => {
            const regex = new RegExp(`${label}:\\s*(\\d+(\\.\\d+)?)`, 'i');
            const match = dimensionsText.match(regex);
            return match ? parseFloat(match[1]) : 0;
        };

        const wIn = extract('Width');
        const hIn = extract('Height');
        const dIn = extract('Depth');

        if (!wIn || !hIn) return null;
        const factor = unit === 'cm' ? 2.54 : 1;

        return {
            w: (wIn * factor).toFixed(1),
            h: (hIn * factor).toFixed(1),
            d: (dIn * factor).toFixed(1),
            rawW: wIn,
            rawH: hIn
        };
    }, [dimensionsText, unit]);

    if (!specs) return null;

    // SVG Layout
    const svgW = 600;
    const svgH = 500;
    const padding = 100;
    const aspectRatio = specs.rawW / specs.rawH;

    let drawW, drawH;
    if (aspectRatio > (svgW / svgH)) {
        drawW = svgW - (padding * 2);
        drawH = drawW / aspectRatio;
    } else {
        drawH = svgH - (padding * 2);
        drawW = drawH * aspectRatio;
    }

    const x = (svgW - drawW) / 2;
    const y = (svgH - drawH) / 2;

    // Architectural Tick Helper
    const Tick = ({ x, y, rotate = 45 }) => (
        <line
            x1={x - 5} y1={y + 5} x2={x + 5} y2={y - 5}
            stroke="black" strokeWidth="1"
            transform={`rotate(${rotate - 45}, ${x}, ${y})`}
        />
    );

    return (
        <section className="py-24 bg-white border-t border-gray-100 overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="text-left">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 block mb-4">
                            Specifications
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-black tracking-tight italic">
                            Technical Scale
                        </h2>
                    </div>

                    <div className="flex bg-[#F1F1F1] p-1 rounded-full">
                        {['in', 'cm'].map((u) => (
                            <button
                                key={u}
                                onClick={() => setUnit(u)}
                                className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${unit === u ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
                                    }`}
                            >
                                {u}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative bg-[#FAF9F6] rounded-[3rem] border border-gray-100 p-8 md:p-20 flex items-center justify-center min-h-[550px] group">

                    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-3xl h-auto" fill="none">
                        {/* Blueprint Grid */}
                        <defs>
                            <pattern id="blueprint-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E5E5E5" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

                        {/* Outer Box (The "Object") */}
                        <motion.rect
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            x={x} y={y} width={drawW} height={drawH}
                            stroke="black" strokeWidth="2"
                        />

                        {/* Subtle Depth Shadow */}
                        <rect x={x + 8} y={y + 8} width={drawW} height={drawH} fill="black" fillOpacity="0.03" />

                        {/* --- HEIGHT (LEFT) --- */}
                        <g>
                            <line x1={x - 50} y1={y} x2={x - 50} y2={y + drawH} stroke="black" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                            <line x1={x - 50} y1={y} x2={x - 50} y2={y + drawH} stroke="black" strokeWidth="1" />
                            <Tick x={x - 50} y={y} />
                            <Tick x={x - 50} y={y + drawH} />
                            <text
                                x={x - 70} y={y + (drawH / 2)}
                                textAnchor="middle"
                                transform={`rotate(-90, ${x - 70}, ${y + (drawH / 2)})`}
                                className="text-[14px] font-mono font-bold fill-black"
                            >
                                {specs.h}{unit}
                            </text>
                        </g>

                        {/* --- WIDTH (BOTTOM) --- */}
                        <g>
                            <line x1={x} y1={y + drawH + 50} x2={x + drawW} y2={y + drawH + 50} stroke="black" strokeWidth="1" />
                            <Tick x={x} y={y + drawH + 50} />
                            <Tick x={x + drawW} y={y + drawH + 50} />
                            <text
                                x={x + (drawW / 2)} y={y + drawH + 75}
                                textAnchor="middle"
                                className="text-[14px] font-mono font-bold fill-black"
                            >
                                {specs.w}{unit}
                            </text>
                        </g>

                        {/* --- DEPTH OVERLAY --- */}
                        <text
                            x={x + drawW - 10} y={y - 15}
                            textAnchor="end"
                            className="text-[10px] font-black fill-gray-400 uppercase tracking-[0.3em]"
                        >
                            Depth: {specs.d}{unit}
                        </text>

                        {/* Interior Cross lines for "Structural" look */}
                        <line x1={x} y1={y} x2={x + drawW} y2={y + drawH} stroke="black" strokeWidth="0.5" opacity="0.05" />
                        <line x1={x + drawW} y1={y} x2={x} y2={y + drawH} stroke="black" strokeWidth="0.5" opacity="0.05" />
                    </svg>

                    {/* Technical Metadata */}
                    {/* <div className="absolute top-10 left-10 flex items-center gap-3">
                        <Ruler size={14} className="text-gray-300" />
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em]">Drafting Mode</span>
                    </div> */}

                    <div className="absolute bottom-10 right-10 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                        {/* <p className="text-[10px] font-mono text-black uppercase tracking-widest">
                            BoltLess Engineering Studio
                        </p> */}
                        <p className="text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                            Scale: Relative to Canvas
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlueprintVisualizer;