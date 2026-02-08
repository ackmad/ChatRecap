
import React, { useState, useEffect, useRef } from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
    Clock, Activity, Star, Film, Volume2, VolumeX,
    Sparkles, Quote, MapPin, Smile, Heart,
    ChevronRight, ChevronLeft, ArrowRight, Download, Share2,
    Calendar, Music, Zap, Coffee, User, MessageCircle,
    AlertTriangle, Moon, Sun, Award, ThumbsUp, Eye, Info
} from 'lucide-react';
import { ChatData, AnalysisResult } from '../types';
import { Button } from './Button';

// Sound Effects Imports
import sfxStartup from '../src/soundfx/UI_System_Startup.wav';
import sfxWhoosh from '../src/soundfx/Trans_Whoosh_Air.wav';
import sfxPop from '../src/soundfx/UI_Pop_Click.wav';
import sfxGlitch from '../src/soundfx/SFX_Glitch_Electric.wav';
import sfxCamera from '../src/soundfx/SFX_Camera_Shutter.mp3';
import sfxPaper from '../src/soundfx/SFX_Paper_Rip.mp3';
import sfxRadar from '../src/soundfx/SFX_Radar_Sonar.mp3';
import sfxBoom from '../src/soundfx/Trans_Cinematic_Boom.mp3';
import sfxSparkle from '../src/soundfx/SFX_Magic_Sparkle.wav';
import sfxClick from '../src/soundfx/UI_Click_Basic.wav';
import sfxSuccess from '../src/soundfx/UI_Success_Confirm.wav';
import sfxSwitch from '../src/soundfx/UI_Switch_Beep.mp3';
import sfxStatic from '../src/soundfx/SFX_Static_Noise.mp3';
import sfxLaser from '../src/soundfx/SFX_Laser_Shot.wav';
import sfxSweep from '../src/soundfx/Trans_Sweep_Clean.mp3';

interface StoryHighlightProps {
    chatData: ChatData;
    analysisResult: AnalysisResult;
    onComplete: () => void;
}

// --- CONFIGURATION ---
const SLIDE_TIMINGS = {
    INTRO: 2.0,
    CONTENT: 5.0,
    OUTRO: 1.5,
};

// --- SHARED COMPONENTS ---

const Tooltip = ({ text, children, className = "relative inline-block" }: { text: string, children: React.ReactNode, className?: string }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={className}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onClick={() => setIsVisible(!isVisible)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-stone-800 text-white text-xs p-3 rounded-xl shadow-xl z-50 pointer-events-none"
                    >
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-stone-800"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Base Slide Wrapper
const SlideWrapper = ({ children, className = "", gradient, texture = "noise" }: { children: React.ReactNode, className?: string, gradient: string, texture?: "noise" | "paper" | "blueprint" | "stars" }) => (
    <motion.div
        className={`w-full h-full relative overflow-hidden flex flex-col items-center justify-center ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
        {/* Dynamic Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-colors duration-1000`}></div>

        {/* Textures */}
        {texture === "noise" && (
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmYiLz4KPC9zdmc+")' }}>
            </div>
        )}
        {texture === "paper" && (
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply filter contrast-120"
                style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")` }}>
            </div>
        )}
        {texture === "blueprint" && (
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
        )}
        {texture === "stars" && (
            <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full opacity-60"
                        style={{
                            width: Math.random() * 3 + 1 + 'px',
                            height: Math.random() * 3 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%'
                        }}
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                ))}
            </div>
        )}

        {/* Ambient Blobs */}
        <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-96 h-96 bg-white/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"
        />

        {/* Safe Area Container */}
        <div className="relative z-10 w-full var-safe-area-x py-12 flex flex-col items-center h-full justify-center px-6">
            {children}
        </div>
    </motion.div>
);

interface SharedSlideProps {
    chatData: ChatData;
    analysisResult: AnalysisResult;
    p1: string;
    p2: string;
    playSound: (sfx: string) => void;
    setShowNext: (show: boolean) => void;
    onComplete: () => void;
}

// --- SLIDE COMPONENTS ---

// 1. INTRO: Cinematic Opening
const SlideIntro = ({ p1, p2, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        const timer = setTimeout(() => setShowNext(true), 6000);
        playSound('startup');
        return () => clearTimeout(timer);
    }, [setShowNext]);

    return (
        <SlideWrapper gradient="from-slate-900 via-purple-900 to-slate-900" texture="stars">
            <motion.div className="flex flex-col items-center text-center space-y-8 max-w-lg">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="flex gap-2 mb-8"
                >
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-75" />
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-150" />
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200"
                    initial={{ y: 20, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    transition={{ delay: 1 }}
                >
                    Recap Chat<br />Highlight
                </motion.h1>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 2, duration: 1.5 }}
                    className="h-[1px] bg-white/30 w-full max-w-xs"
                />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-xl text-white/80 font-handwriting">{p1}</span>
                    <span className="text-sm text-white/40 my-1">&</span>
                    <span className="text-xl text-white/80 font-handwriting">{p2}</span>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4 }}
                    className="text-white/50 text-sm mt-12 font-mono"
                >
                    &gt; Membuka arsip memori...
                </motion.p>
            </motion.div>
        </SlideWrapper>
    );
};

// 2. OVERVIEW: Sticker Slap
const SlideOverview = ({ analysisResult, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        const timer = setTimeout(() => setShowNext(true), 5000);
        return () => clearTimeout(timer);
    }, [setShowNext]);

    const tags = [
        analysisResult.relationshipType?.toUpperCase() || "FRIENDS",
        analysisResult.emotionalTone || "ROLLERCOASTER",
        ...(analysisResult.dominantTopics?.slice(0, 1).map(t => t.name) || ["RANDOM"]),
    ];

    return (
        <SlideWrapper gradient="from-yellow-50 via-orange-50 to-red-50" texture="paper">
            <div className="text-center w-full max-w-md">
                <motion.h2
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-stone-500 font-bold uppercase tracking-widest mb-8 text-sm"
                >
                    Overview Hubungan
                </motion.h2>

                <div className="flex flex-col gap-4 items-center">
                    {tags.map((tag, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 2, opacity: 0, rotate: Math.random() * 10 - 5 }}
                            animate={{ scale: 1, opacity: 1, rotate: Math.random() * 10 - 5 }}
                            transition={{
                                type: "spring",
                                damping: 12,
                                stiffness: 200,
                                delay: 0.5 + (i * 0.6)
                            }}
                            onAnimationComplete={() => playSound('pop')}
                            className={`
                                py-3 px-8 bg-white border-2 border-stone-800 shadow-[4px_4px_0px_0px_rgba(28,25,23,1)]
                                text-stone-800 font-black text-xl md:text-2xl transform rotate-2
                            `}
                        >
                            {tag}
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: 'spring' }}
                    className="mt-12 flex justify-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-200 border-2 border-white shadow-lg flex items-center justify-center text-2xl">👤</div>
                    <div className="w-16 h-16 rounded-full bg-pink-200 border-2 border-white shadow-lg flex items-center justify-center text-2xl">👤</div>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
                    className="text-stone-400 text-xs mt-4"
                >
                    *Berdasarkan analisis vibes chat kalian
                </motion.p>
            </div>
        </SlideWrapper>
    );
};

// 3. STATS: Blueprint Grid & Count Up
const SlideStats = ({ chatData, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 5000);
        playSound('sweep');
    }, [setShowNext]);

    const StatItem = ({ label, value, icon: Icon, delay, tooltip }: any) => (
        <Tooltip text={tooltip} className="relative w-full block">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay, type: "spring" }}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center w-full cursor-help hover:bg-white/90 transition-colors"
            >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 mb-3">
                    <Icon size={20} />
                </div>
                <div className="text-3xl font-bold text-stone-800 font-mono mb-1">{value}</div>
                <div className="text-xs text-stone-500 uppercase tracking-wider">{label}</div>
                <div className="mt-2 opacity-50">
                    <Info size={12} className="text-stone-400" />
                </div>
            </motion.div>
        </Tooltip>
    );

    return (
        <SlideWrapper gradient="from-blue-50 to-indigo-50" texture="blueprint">
            <div className="w-full max-w-sm space-y-4">
                <motion.div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-stone-800">The Matrix Data</h2>
                    <p className="text-stone-500 text-sm">Angka-angka penting kalian.</p>
                </motion.div>

                <StatItem
                    icon={MessageCircle}
                    label="Total Pesan"
                    value={chatData.totalMessages.toLocaleString()}
                    delay={0.5}
                    tooltip="Total bubble chat yang kalian kirim berdua sejak awal."
                />
                <StatItem
                    icon={Calendar}
                    label="Durasi Chat"
                    value={chatData.durationString}
                    delay={0.8}
                    tooltip="Rentang waktu dari pesan pertama sampai pesan terakhir."
                />
                <StatItem
                    icon={Clock}
                    label="Rata-rata / Hari"
                    value={chatData.avgMessagesPerDay ? chatData.avgMessagesPerDay.toLocaleString() : Math.round(chatData.totalMessages / (parseInt(chatData.durationString) || 1)).toString()}
                    delay={1.1}
                    tooltip="Rata-rata jumlah chat per hari (Total Chat / Durasi Hari)."
                />
            </div>
        </SlideWrapper>
    );
};

// 4. WHO TALKS MORE: Bubble Battle
const SlideWhoTalksMore = ({ chatData, p1, p2, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 5000);
        playSound('boom');
    }, [setShowNext]);

    const stats1 = chatData.participantStats[p1];
    const stats2 = chatData.participantStats[p2];

    const c1 = stats1?.messageCount || 0;
    const c2 = stats2?.messageCount || 0;
    const total = c1 + c2 || 1; // Avoid div 0

    const p1Percent = Math.round((c1 / total) * 100);
    const p2Percent = Math.round((c2 / total) * 100);

    // Determine winner purely on data
    const winner = c1 > c2 ? p1 : (c2 > c1 ? p2 : "Seimbang");

    return (
        <SlideWrapper gradient="from-teal-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-stone-800 mb-12 text-center absolute top-20">Dominance Meter</h2>

            <div className="flex items-center justify-center gap-4 w-full h-64 relative">
                {/* Bubble P1 */}
                <motion.div
                    initial={{ width: 50, height: 50 }}
                    animate={{ width: Math.max(80, p1Percent * 3.5), height: Math.max(80, p1Percent * 3.5) }}
                    transition={{ type: "spring", duration: 2 }}
                    className="rounded-full bg-teal-400 flex items-center justify-center text-white font-bold shadow-lg z-10 relative"
                >
                    <span className="absolute -top-8 text-stone-600 text-sm whitespace-nowrap">{p1}</span>
                    {p1Percent}%
                </motion.div>

                {/* VS */}
                <span className="font-black text-white text-xl bg-stone-300 rounded-full w-8 h-8 flex items-center justify-center z-20">VS</span>

                {/* Bubble P2 */}
                <motion.div
                    initial={{ width: 50, height: 50 }}
                    animate={{ width: Math.max(80, p2Percent * 3.5), height: Math.max(80, p2Percent * 3.5) }}
                    transition={{ type: "spring", duration: 2, delay: 0.2 }}
                    className="rounded-full bg-emerald-400 flex items-center justify-center text-white font-bold shadow-lg z-10 relative"
                >
                    <span className="absolute -top-8 text-stone-600 text-sm whitespace-nowrap">{p2}</span>
                    {p2Percent}%
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
                className="mt-12 bg-white px-6 py-3 rounded-full shadow-sm text-stone-600 font-medium"
            >
                🏆 {winner === "Seimbang" ? "Kalian berdua sama kuat!" : `${winner} lebih cerewet!`}
            </motion.div>
        </SlideWrapper>
    );
};

// 5. QUOTES: Wall of Fame (Cute Edition)
const SlideQuotes = ({ analysisResult, setShowNext, playSound }: SharedSlideProps) => {
    const [selectedQuote, setSelectedQuote] = useState<{ text: string, sender: string, context: string, color: string } | null>(null);

    useEffect(() => {
        setTimeout(() => setShowNext(true), 8000);

        const quoteCount = Math.min(5, (analysisResult.memorableLines?.length || 0) + (analysisResult.bestQuote ? 1 : 0));
        for (let i = 0; i < quoteCount; i++) {
            setTimeout(() => playSound('paper'), 300 + (i * 600));
        }
    }, [setShowNext, analysisResult, playSound]);

    // Data Preparation
    const activeQuotes: { text: string; sender: string; context: string; theme: any }[] = [];

    // Visual Themes
    const themes = [
        { bg: "bg-yellow-200", text: "text-yellow-900", tape: "bg-yellow-400/30", rotate: 2 },
        { bg: "bg-rose-200", text: "text-rose-900", tape: "bg-rose-400/30", rotate: -3 },
        { bg: "bg-blue-200", text: "text-blue-900", tape: "bg-blue-400/30", rotate: 1 },
        { bg: "bg-green-200", text: "text-green-900", tape: "bg-green-400/30", rotate: -2 },
        { bg: "bg-purple-200", text: "text-purple-900", tape: "bg-purple-400/30", rotate: 3 },
    ];

    // 1. Add Best Quote
    if (analysisResult.bestQuote) {
        activeQuotes.push({
            text: analysisResult.bestQuote,
            sender: analysisResult.quoteAuthor || "Someone",
            context: analysisResult.quoteContext || "",
            theme: themes[0]
        });
    }

    // 2. Add Others
    const extras = [
        ...(analysisResult.memorableLines || []),
        ...(analysisResult.runnerUpQuotes || []).map(q => ({ text: q.text, sender: q.author, context: "" }))
    ];

    extras.forEach((item, index) => {
        if (activeQuotes.length >= 5) return;
        const isExist = activeQuotes.some(q => q.text === item.text);
        if (!isExist) {
            activeQuotes.push({
                text: item.text,
                sender: item.sender || "Unknown",
                context: (item as any).context || "",
                theme: themes[(activeQuotes.length) % themes.length]
            });
        }
    });

    if (activeQuotes.length === 0) {
        activeQuotes.push({
            text: "Belum ada kutipan yang cukup ikonik.",
            sender: "AI System",
            context: "Chat lebih banyak lagi!",
            theme: themes[0]
        });
    }

    return (
        <SlideWrapper gradient="from-orange-50 to-amber-50" texture="paper">
            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-10 left-10 opacity-20 rotate-45"><Star size={64} className="text-yellow-400 fill-current" /></div>
                <div className="absolute bottom-20 right-10 opacity-20 -rotate-12"><Heart size={80} className="text-pink-400 fill-current" /></div>

                <motion.h2
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-amber-800/60 font-black uppercase tracking-widest mb-8 text-lg md:text-xl absolute top-8 md:top-12 z-10 bg-white/50 px-6 py-2 rounded-full backdrop-blur-sm shadow-sm"
                >
                    ✨ Wall of Fame ✨
                </motion.h2>

                <div className={`
                    relative w-full max-w-5xl flex flex-wrap justify-center content-center items-center gap-6 md:gap-8
                    ${activeQuotes.length === 1 ? 'h-full' : 'mt-16 md:mt-0'}
                `}>
                    {activeQuotes.map((quote, i) => {
                        const isSingle = activeQuotes.length === 1;
                        const theme = quote.theme;
                        const stickerRotation = Math.random() * 30 - 15;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0, rotate: theme.rotate * 5 }}
                                animate={{ opacity: 1, scale: 1, rotate: theme.rotate }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 200,
                                    delay: 0.2 + (i * 0.2)
                                }}
                                whileHover={{ scale: 1.1, rotate: 0, zIndex: 50, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => quote.context && setSelectedQuote({ ...quote, color: theme.bg })}
                                className={`
                                    relative p-6 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-1px_rgba(0,0,0,0.06),0px_10px_15px_-3px_rgba(0,0,0,0.1)] 
                                    font-handwriting flex flex-col justify-between
                                    ${theme.bg} ${theme.text} cursor-pointer
                                    ${isSingle ? 'w-80 h-80 md:w-96 md:h-96 text-2xl md:text-3xl p-10' : 'w-40 h-40 md:w-56 md:h-56 text-sm md:text-lg'}
                                `}
                                style={{
                                    boxShadow: "5px 5px 15px rgba(0,0,0,0.15)"
                                }}
                            >
                                {/* Washi Tape Effect */}
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 ${theme.tape} backdrop-blur-sm -rotate-1 opacity-80`} />

                                {/* Sticker Decoration */}
                                {i % 2 === 0 && <Star size={24} className="absolute -top-2 -right-2 text-yellow-400 fill-current drop-shadow-sm" style={{ transform: `rotate(${stickerRotation}deg)` }} />}
                                {i % 2 !== 0 && <Heart size={24} className="absolute -bottom-2 -right-2 text-rose-400 fill-current drop-shadow-sm" style={{ transform: `rotate(${stickerRotation}deg)` }} />}

                                <div className={`flex-1 flex items-center justify-center text-center overflow-hidden font-medium ${isSingle ? 'leading-relaxed' : 'leading-snug'}`}>
                                    <span className="line-clamp-4 relative z-10">"{quote.text}"</span>
                                </div>

                                <div className="text-right mt-3 opacity-60 text-xs font-sans font-bold uppercase tracking-wide border-t border-black/5 pt-2">
                                    - {quote.sender}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="absolute bottom-8 text-amber-900/40 text-xs font-mono bg-white/30 px-3 py-1 rounded-full"
                >
                    {activeQuotes.length > 1 ? "Tap kertas untuk lihat aslinya" : "Tap untuk kenangan penuh"}
                </motion.p>
            </div>

            {/* Context Modal (Enhanced) */}
            <AnimatePresence>
                {selectedQuote && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-6"
                        onClick={() => setSelectedQuote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50, rotate: 5 }}
                            animate={{ scale: 1, y: 0, rotate: 0 }}
                            exit={{ scale: 0.8, y: 50, rotate: 5 }}
                            className={`${selectedQuote.color} p-8 rounded-sm max-w-sm w-full shadow-2xl relative`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                backgroundImage: `url("https://www.transparenttextures.com/patterns/cream-paper.png")`,
                            }}
                        >
                            {/* Tape on Modal */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 backdrop-blur-md rotate-1 shadow-sm" />

                            <h3 className="font-black text-xl mb-6 flex items-center gap-2 text-stone-800 opacity-80">
                                <MessageCircle size={20} /> Moments
                            </h3>

                            <div className="space-y-4 text-sm text-stone-800 font-medium leading-relaxed font-handwriting text-lg">
                                {selectedQuote.context ? (
                                    <p className="whitespace-pre-wrap">{selectedQuote.context}</p>
                                ) : (
                                    <p className="opacity-50 italic">Hanya potongan kenangan ini yang tersisa.</p>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={() => setSelectedQuote(null)}
                                    className="bg-stone-800 text-white px-6 py-2 rounded-full hover:bg-stone-700 hover:scale-105 transition-all text-sm font-bold shadow-lg"
                                >
                                    Tutup Kenangan
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SlideWrapper>
    );
};

// 6. TIMELINE: Scrolling
const SlideTimeline = ({ analysisResult, setShowNext, playSound, chatData }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 6000);
        playSound('sweep');
    }, [setShowNext, playSound]);

    interface TimelineEvent {
        date: string;
        title: string;
        description: string;
        mood?: string;
    }

    let events: TimelineEvent[] = [];

    // 1. Try Key Moments
    if (analysisResult.keyMoments && analysisResult.keyMoments.length > 0) {
        events = analysisResult.keyMoments.map((k: any) => ({
            date: k.date,
            title: k.title,
            description: k.description,
            mood: k.mood
        }));
    }
    // 2. Try Phases
    else if (analysisResult.phases && analysisResult.phases.length > 0) {
        events = analysisResult.phases.map((p: any) => ({
            date: p.period,
            title: p.name,
            description: p.description || p.mood || "Fase hubungan",
            mood: p.mood
        }));
    }
    // 3. Fallback to Raw Data
    else if (chatData?.dateRange?.start) {
        const start = new Date(chatData.dateRange.start).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
        const end = chatData.dateRange.end
            ? new Date(chatData.dateRange.end).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
            : "Sekarang";

        events = [
            { date: start, title: "Awal Cerita", description: "Pesan pertama kalian.", mood: "neutral" },
            { date: end, title: "Hingga Kini", description: `Sudah ${chatData.durationString} berlalu.`, mood: "neutral" }
        ];
    }

    // Slice to 3 items
    const displayEvents = events.slice(0, 3);

    return (
        <SlideWrapper gradient="from-purple-50 to-indigo-100">
            <div className="w-full max-w-md h-full flex flex-col justify-center relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-purple-200" />

                <div className="space-y-12 pl-16">
                    {displayEvents.map((ev, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + (i * 1.5), duration: 0.8 }}
                            className="relative"
                        >
                            {/* Dot on line */}
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + (i * 1.5) }}
                                className="absolute -left-[41px] top-4 w-4 h-4 bg-purple-500 rounded-full border-4 border-white shadow-sm"
                            />

                            <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-sm border border-white/60">
                                <span className="text-xs font-bold text-purple-500 uppercase">{ev.date}</span>
                                <h4 className="font-bold text-stone-800">{ev.title}</h4>
                                <p className="text-stone-600 text-sm mt-1">{ev.description}</p>
                            </div>
                        </motion.div>
                    ))}

                    {displayEvents.length === 0 && (
                        <div className="text-center text-stone-500 italic">
                            Belum ada momen kunci yang terdeteksi AI.
                        </div>
                    )}
                </div>
            </div>
        </SlideWrapper>
    );
};

// 7. TOPICS: Cloud Bubble
const SlideTopics = ({ analysisResult, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 5000);
        playSound('pop');
    }, [setShowNext]);

    const topics = analysisResult.topTopics || [];

    if (topics.length === 0) {
        return (
            <SlideWrapper gradient="from-cyan-50 to-blue-50">
                <h2 className="text-stone-500 uppercase tracking-widest text-sm mb-12 font-bold">Topik Favorit</h2>
                <div className="text-stone-400 italic">Belum cukup data untuk mendeteksi topik.</div>
            </SlideWrapper>
        );
    }

    return (
        <SlideWrapper gradient="from-cyan-50 to-blue-50">
            <h2 className="text-stone-500 uppercase tracking-widest text-sm mb-12 font-bold">Topik Favorit</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 max-w-sm h-64 content-center">
                {topics.slice(0, 6).map((t, i) => {
                    const size = Math.max(80, Math.min(150, (t.count || 1) * 10));
                    return (
                        <Tooltip key={i} text={`Disebut: ${t.count} kali`}>
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.2 + (i * 0.1)
                                }}
                                whileHover={{ scale: 1.1, rotate: Math.random() * 10 - 5 }}
                                className="rounded-full bg-white shadow-md flex items-center justify-center text-center p-4 cursor-pointer border border-blue-100 hover:bg-blue-50 transition-colors"
                                style={{ width: size, height: size }}
                            >
                                <span className="font-bold text-stone-700 text-sm sm:text-base">{t.topic}</span>
                            </motion.div>
                        </Tooltip>
                    );
                })}
            </div>
            <p className="mt-8 text-stone-400 text-xs text-center px-8">Tap bubble untuk info detail.</p>
        </SlideWrapper>
    );
};

// 8. BATTLE MODE: Conflicts
const SlideConflicts = ({ analysisResult, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 6000);
        playSound('glitch');
    }, [setShowNext]);

    const score = analysisResult.toxicScore;
    const hasData = score !== undefined && score !== null;
    const isToxic = (score || 0) > 30;

    return (
        <SlideWrapper gradient="from-rose-50 to-red-50">
            <div className="text-center w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        className="text-6xl"
                    >
                        {hasData ? (isToxic ? '🌩️' : '🕊️') : '❓'}
                    </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-stone-800 mb-2">Konflik Meter</h2>
                <p className="text-stone-500 mb-8">
                    {hasData
                        ? (isToxic ? "Ada sedikit bumbu drama..." : "Adem ayem tentrem.")
                        : "Tidak cukup data untuk analisis konflik."}
                </p>

                {hasData ? (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-100 flex items-center gap-4">
                            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="text-red-500" size={20} /></div>
                            <div className="flex-1 text-left">
                                <div className="text-xs text-stone-400 font-bold uppercase">Toxic Level</div>
                                <div className="h-2 bg-stone-100 rounded-full mt-1 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className={`h-full ${isToxic ? 'bg-red-500' : 'bg-green-500'}`}
                                    />
                                </div>
                            </div>
                            <span className="font-bold text-stone-600">{score}%</span>
                        </div>

                        <div className="bg-white/60 p-4 rounded-xl text-sm italic text-stone-600">
                            "{analysisResult.toxicInsight || "Kalian jarang berantem, pertahankan!"}"
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/40 p-6 rounded-xl text-stone-400 italic">
                        AI butuh lebih banyak chat untuk mendeteksi pola konflik.
                    </div>
                )}
            </div>
        </SlideWrapper>
    );
};

// 9. PEAK VIBES (Dynamic active time)
const SlideMidnight = ({ chatData, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 5000);
        playSound('sparkle');
    }, [setShowNext]);

    const hour = chatData.busiestHour ?? 0;
    const formattedTime = `${hour.toString().padStart(2, '0')}:00`;

    // Determine Label based on hour
    let timeLabel = "MIDNIGHT VIBES";
    let icon = <Moon className="text-yellow-200" size={32} />;
    let desc = "Jam rawan overthinking & deep talk kalian.";
    let badge = "Night Owl Certified 🦉";
    let gradient = "from-indigo-900 to-purple-900";
    let texture: "stars" | "noise" | "paper" | "blueprint" = "stars";

    if (hour >= 5 && hour < 11) {
        timeLabel = "MORNING VIBES";
        icon = <Sun className="text-orange-400" size={32} />;
        desc = "Semangat pagi yang cerah!";
        badge = "Early Bird 🐦";
        gradient = "from-orange-200 to-yellow-100";
        texture = "paper";
    } else if (hour >= 11 && hour < 15) {
        timeLabel = "LUNCH TIME";
        icon = <Sun className="text-yellow-500" size={32} />;
        desc = "Chatting sambil makan siang?";
        badge = "Lunch Break Chatter 🥪";
        gradient = "from-blue-200 to-cyan-100";
        texture = "noise";
    } else if (hour >= 15 && hour < 19) {
        timeLabel = "AFTERNOON VIBES";
        icon = <Coffee className="text-brown-500" size={32} />;
        desc = "Menemani sore yang santai.";
        badge = "Sunset Lover 🌅";
        gradient = "from-orange-300 to-pink-200";
        texture = "noise";
    }

    return (
        <SlideWrapper gradient={gradient} texture={texture} className={hour < 18 && hour > 5 ? "text-stone-800" : "text-white"}>
            <div className="text-center">
                <motion.div
                    initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="inline-block p-3 rounded-full bg-white/20 backdrop-blur mb-6"
                >
                    {icon}
                </motion.div>

                <h2 className={`${hour < 18 && hour > 5 ? "text-stone-600" : "text-indigo-200"} font-medium tracking-widest mb-2 uppercase`}>{timeLabel}</h2>

                <div className={`font-mono text-5xl md:text-7xl font-bold tracking-tighter mb-4 tabular-nums relative ${hour < 18 && hour > 5 ? "text-stone-800" : "text-white"}`}>
                    <motion.span
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className={`absolute -right-6 top-0 text-xs font-sans px-2 py-0.5 border rounded ${hour < 18 && hour > 5 ? "border-stone-400 text-stone-500" : "border-green-400 text-green-400"}`}
                    >
                        PEAK
                    </motion.span>
                    {formattedTime}
                </div>

                <p className={`${hour < 18 && hour > 5 ? "text-stone-500" : "text-white/60"} max-w-xs mx-auto`}>
                    {desc}
                </p>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    className="mt-8 flex justify-center gap-2"
                >
                    <span className={`text-xs px-3 py-1 rounded-full border ${hour < 18 && hour > 5 ? "bg-stone-100 text-stone-600 border-stone-300" : "bg-indigo-800 text-indigo-200 border-indigo-700"}`}>
                        {badge}
                    </span>
                </motion.div>
            </div>
        </SlideWrapper>
    );
};

// 10. GENRE / TITLE
const SlideGenre = ({ analysisResult, setShowNext, playSound }: SharedSlideProps) => {
    useEffect(() => {
        setTimeout(() => setShowNext(true), 6000);
        playSound('boom'); // heavy reveal
    }, [setShowNext, playSound]);

    const genres = [
        analysisResult.emotionalTone?.toUpperCase() || "LIFE",
        analysisResult.relationshipType?.toUpperCase() || "STORY"
    ];

    const title = analysisResult.storyTitle?.toUpperCase() || "THE UNTOLD STORY";
    // Dynamic font sizing based on length
    const isLongTitle = title.length > 25;
    const isVeryLongTitle = title.length > 50;

    return (
        <SlideWrapper gradient="from-gray-900 to-stone-900" texture="noise">
            {/* Constrained width container for better arch shape */}
            <div className="w-full max-w-3xl px-4 flex flex-col items-center justify-center pt-20">

                <div className="w-full border-[1px] border-yellow-600/30 p-2 rounded-t-full bg-black/40 backdrop-blur-md shadow-2xl">
                    <div className="w-full border-[1px] border-yellow-600/50 rounded-t-full p-8 md:p-16 text-center text-yellow-50 relative overflow-hidden flex flex-col items-center justify-end min-h-[350px] md:min-h-[450px]">

                        {/* Shine Effect */}
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                            className="absolute top-0 bottom-0 w-40 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 blur-xl"
                        />

                        {/* Content Layer */}
                        <div className="relative z-10 w-full flex flex-col items-center gap-4 md:gap-6 pb-4">
                            <div className="uppercase text-[10px] md:text-xs tracking-[0.4em] text-yellow-600/80 font-bold mb-2">
                                The Movie of Us
                            </div>

                            <motion.h1
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`
                                    font-black leading-tight font-heading text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-700
                                    filter drop-shadow-lg breaking-words w-full
                                    ${isVeryLongTitle ? 'text-2xl md:text-4xl' : (isLongTitle ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl')}
                                `}
                            >
                                {title}
                            </motion.h1>

                            <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm font-mono text-yellow-200/60 uppercase tracking-wider mt-2">
                                {genres.map((g, i) => (
                                    <React.Fragment key={i}>
                                        <span>{g}</span>
                                        {i < genres.length - 1 && <span className="opacity-30">•</span>}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-yellow-800 to-transparent my-4" />

                            <div className="text-[9px] md:text-[10px] text-stone-600 uppercase tracking-[0.3em] font-medium">
                                Directed by Fate & WiFi
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SlideWrapper>
    );
};

// 11. OUTRO
const SlideOutro = ({ onComplete, playSound }: SharedSlideProps) => {
    useEffect(() => {
        playSound('success');
    }, [playSound]);

    return (
        <SlideWrapper gradient="from-white to-stone-100" texture="noise">
            <motion.div className="text-center space-y-8 max-w-sm w-full">
                <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-20 h-20 bg-stone-900 rounded-full mx-auto flex items-center justify-center text-white text-3xl shadow-2xl"
                >
                    ✨
                </motion.div>

                <div>
                    <h2 className="text-3xl font-bold text-stone-900 mb-3">Terima Kasih.</h2>
                    <p className="text-stone-500">
                        Chat ini bukan cuma teks.<br />Ini kenangan kalian.
                    </p>
                </div>

                <div className="space-y-3 pt-6">
                    <Button onClick={onComplete} className="w-full py-4 bg-stone-900 text-white rounded-xl shadow-lg hover:bg-stone-800 flex justify-center items-center gap-2 transition-transform hover:scale-105">
                        <ArrowRight size={18} />
                        Lihat Dashboard Lengkap
                    </Button>
                    <button onClick={onComplete} className="w-full py-3 text-stone-500 hover:text-stone-900 text-sm font-medium flex justify-center items-center gap-2">
                        <Download size={16} />
                        Download PDF
                    </button>
                    <button onClick={onComplete} className="w-full py-3 text-stone-500 hover:text-stone-900 text-sm font-medium flex justify-center items-center gap-2">
                        <Share2 size={16} />
                        Share to Story
                    </button>
                </div>
            </motion.div>
        </SlideWrapper>
    );
};

// --- MAIN COMPONENT ---


// --- MAIN COMPONENT ---


export const StoryHighlight: React.FC<StoryHighlightProps> = ({
    chatData,
    analysisResult,
    onComplete
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showNext, setShowNext] = useState(false);

    // Audio System
    const bgm = useBackgroundMusic({ initialVolume: 0.25, fadeDuration: 1500 });
    const [isMuted, setIsMuted] = useState(false); // UI toggle state, sync with bgm

    // Sync mute state
    useEffect(() => {
        bgm.setIsMuted(isMuted);
    }, [isMuted, bgm]);

    // Track Selection Logic
    const getTrackForSlide = (index: number) => {
        // Special Slides
        if (index === 7) return 'mystery'; // Conflicts -> Suspense/Mystery
        if (index === 8) return 'romance'; // Midnight -> Piano/Romance (or use specific midnight track if we had one)
        if (index === 0) return 'friends'; // Intro -> Start neutral/cheerful

        // Default Relationship Mapping
        // Map raw relationshipType to our keyword system
        const type = analysisResult.relationshipType || 'other';
        return type; // The hook handles fuzzy matching (e.g. 'friendship_boys' -> 'boys')
    };

    // Manage BGM Changes
    useEffect(() => {
        if (!bgm.userEnabled) return;

        const category = getTrackForSlide(currentSlide);
        bgm.playTrack(category);
    }, [currentSlide, bgm.userEnabled]);

    // Derived Data
    const p1 = chatData.participants[0] || 'User 1';
    const p2 = chatData.participants[1] || 'User 2';

    // Sound Controller
    const playSound = (sfx: string) => {
        if (isMuted) return;

        // Duck BGM when SFX plays
        bgm.duck();

        let audioSrc = '';
        switch (sfx) {
            case 'startup': audioSrc = sfxStartup; break;
            case 'whoosh': audioSrc = sfxWhoosh; break;
            case 'pop': audioSrc = sfxPop; break;
            case 'glitch': audioSrc = sfxGlitch; break;
            case 'camera': audioSrc = sfxCamera; break;
            case 'paper': audioSrc = sfxPaper; break;
            case 'radar': audioSrc = sfxRadar; break;
            case 'boom': audioSrc = sfxBoom; break;
            case 'sparkle': audioSrc = sfxSparkle; break;
            case 'click': audioSrc = sfxClick; break;
            case 'success': audioSrc = sfxSuccess; break;
            case 'switch': audioSrc = sfxSwitch; break;
            case 'static': audioSrc = sfxStatic; break;
            case 'laser': audioSrc = sfxLaser; break;
            case 'sweep': audioSrc = sfxSweep; break;
            default: return;
        }
        const audio = new Audio(audioSrc);
        audio.volume = 0.4;
        audio.play().catch(e => { });
    };

    // Transition Logic
    useEffect(() => {
        if (currentSlide > 0 && currentSlide < slides.length) {
            playSound('whoosh');
        }
        setShowNext(false);
    }, [currentSlide]);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            playSound('click');
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            playSound('click');
            setCurrentSlide(prev => prev - 1);
        }
    };

    const slides = [
        SlideIntro,
        SlideOverview,
        SlideStats,
        SlideWhoTalksMore,
        SlideTimeline,
        SlideQuotes,
        SlideTopics,
        SlideConflicts,
        SlideMidnight,
        SlideGenre,
        SlideOutro
    ];

    const CurrentSlideComponent = slides[currentSlide];

    const sharedProps: SharedSlideProps = {
        chatData,
        analysisResult,
        p1,
        p2,
        playSound,
        setShowNext,
        onComplete
    };

    return (
        <div className="fixed inset-0 z-[100] bg-stone-50 text-stone-800 font-sans overflow-hidden">

            {/* --- TOP NAV --- */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
                <motion.button
                    onClick={handleBack}
                    className={`pointer-events-auto p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-stone-600 hover:bg-white/40 transition-colors ${currentSlide === 0 ? 'opacity-0' : 'opacity-100'}`}
                >
                    <ChevronLeft size={24} />
                </motion.button>

                <div className="flex gap-1">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i <= currentSlide ? 'bg-stone-800 w-6' : 'bg-stone-300 w-2'}`}
                        />
                    ))}
                </div>

                <div className="pointer-events-auto flex gap-2">
                    <button onClick={() => setIsMuted(!isMuted)} className="p-3 bg-white/20 backdrop-blur-md rounded-full">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button onClick={onComplete} className="p-3 text-xs font-bold text-stone-400">SKIP</button>
                </div>
            </div>

            {/* --- MAIN STAGE --- */}
            <AnimatePresence mode="wait">
                <CurrentSlideComponent key={currentSlide} {...sharedProps} />
            </AnimatePresence>

            {/* --- BOTTOM CONTROLS --- */}
            {(currentSlide < slides.length - 1) && (
                <motion.div
                    className="absolute bottom-10 right-6 md:right-10 z-[60]"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: showNext ? 0 : 100,
                        opacity: showNext ? 1 : 0
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <motion.button
                        onClick={handleNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-stone-900 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-2 group"
                    >
                        <span className="font-bold">Next</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>
            )}

            <div className="absolute bottom-6 left-6 text-[10px] text-stone-400/50 font-mono pointer-events-none">
                RECAP CHAT • YOUR STORY
            </div>

            {/* --- AUDIO SYSTEM UI --- */}

            {/* Now Playing Indicator */}
            {bgm.isPlaying && !isMuted && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-50 flex items-center gap-3 bg-white/10 backdrop-blur-md dark:bg-black/20 px-3 py-1.5 rounded-full border border-white/10 pointer-events-none"
                >
                    <div className="flex items-end gap-[2px] h-3 mb-0.5">
                        <motion.div animate={{ height: [4, 12, 6, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-green-400 rounded-full" />
                        <motion.div animate={{ height: [10, 5, 12, 7] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-0.5 bg-green-400 rounded-full" />
                        <motion.div animate={{ height: [6, 11, 4, 9] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-0.5 bg-green-400 rounded-full" />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-stone-500 tracking-wider">
                        {(bgm.currentTrackName || '').replace('.mp3', '').replace(/^\d+_/, '').replace(/_/g, ' ') || 'Atmosphere'}
                    </span>
                </motion.div>
            )}

            {/* Enable Audio Overlay - Mobile/First Load */}
            <AnimatePresence>
                {!bgm.userEnabled && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white p-6 rounded-2xl shadow-2xl max-w-xs w-full text-center"
                        >
                            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-800">
                                <Music size={32} />
                            </div>
                            <h3 className="font-bold text-stone-800 text-lg mb-2">Sound On?</h3>
                            <p className="text-stone-500 text-sm mb-6">Nikmati pengalaman audio visual penuh.</p>

                            <div className="space-y-3">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => bgm.enableAudio()}
                                    className="w-full py-3 bg-stone-900 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Volume2 size={18} />
                                    Hidupkan Suara
                                </motion.button>
                                <button
                                    onClick={() => { bgm.setIsMuted(true); bgm.enableAudio(); }}
                                    className="text-xs text-stone-400 hover:text-stone-600 font-medium"
                                >
                                    Lanjut Tanpa Suara
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};
