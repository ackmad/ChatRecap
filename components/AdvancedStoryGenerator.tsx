import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, X, ChevronLeft, ChevronRight,
    Heart, TrendingUp, MessageCircle, Calendar, User, Zap,
    Eye, EyeOff, Check, Loader2, Info, Sparkles
} from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { StoryTemplateNew as StoryTemplate, TemplateType, ThemeType } from './StoryTemplateNew';
import { Button } from './Button';
import { AnalysisResult, ChatData } from '../types';


interface AdvancedStoryGeneratorProps {
    analysisResult: AnalysisResult;
    chatData: ChatData;
    onBack: () => void;
    isDarkMode: boolean;
}

export const AdvancedStoryGenerator: React.FC<AdvancedStoryGeneratorProps> = ({
    analysisResult,
    chatData,
    onBack,
    isDarkMode
}) => {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('stats');
    const [selectedTheme, setSelectedTheme] = useState<ThemeType>('pastel');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [downloadMode, setDownloadMode] = useState<'single' | 'multi'>('single');

    // Privacy settings
    const [privacyMode, setPrivacyMode] = useState({
        hideNames: false,
        blurSensitive: false,
        safeQuote: false
    });

    const templates = [
        {
            id: 'stats' as TemplateType,
            name: 'Chat Stats',
            icon: TrendingUp,
            desc: 'Total pesan & statistik chat',
            emoji: '📊'
        },
        {
            id: 'active-day' as TemplateType,
            name: 'Most Active Day',
            icon: Calendar,
            desc: 'Hari paling ramai ngobrol',
            emoji: '📅'
        },
        {
            id: 'who-talks' as TemplateType,
            name: 'Who Talks More?',
            icon: MessageCircle,
            desc: 'Siapa yang lebih banyak ngomong',
            emoji: '🗣️'
        },
        {
            id: 'late-night' as TemplateType,
            name: 'Late Night Talks',
            icon: User,
            desc: 'Chat jam malam',
            emoji: '🌙'
        },
        {
            id: 'peak-moment' as TemplateType,
            name: 'Peak Moment',
            icon: TrendingUp,
            desc: 'Momen paling intens',
            emoji: '🏔️'
        },
        {
            id: 'top-words' as TemplateType,
            name: 'Top Words',
            icon: MessageCircle,
            desc: 'Kata yang sering muncul',
            emoji: '🔤'
        },
        {
            id: 'toxic-meter' as TemplateType,
            name: 'Toxic Meter',
            icon: Zap,
            desc: 'Seberapa toxic chat kalian',
            emoji: '🔥'
        },
        {
            id: 'reply-speed' as TemplateType,
            name: 'Reply Speed',
            icon: Zap,
            desc: 'Siapa yang paling gercep',
            emoji: '⚡'
        },
        {
            id: 'ghosting' as TemplateType,
            name: 'Ghosting Detector',
            icon: EyeOff,
            desc: 'Siapa raja ghosting',
            emoji: '👻'
        },
        {
            id: 'topic-ranking' as TemplateType,
            name: 'Topic Ranking',
            icon: TrendingUp,
            desc: 'Top 5 topik favorit',
            emoji: '📊'
        },
        {
            id: 'quote-year' as TemplateType,
            name: 'Quote of the Year',
            icon: MessageCircle,
            desc: 'Chat paling memorable',
            emoji: '💬'
        },
        {
            id: 'care-meter' as TemplateType,
            name: 'Care Meter',
            icon: Heart,
            desc: 'Siapa yang lebih perhatian',
            emoji: '❤️'
        },
        {
            id: 'overthinking' as TemplateType,
            name: 'Overthinking Detector',
            icon: Zap,
            desc: 'Raja mikir berlebihan',
            emoji: '🤔'
        },
        {
            id: 'typing-style' as TemplateType,
            name: 'Typing Style',
            icon: User,
            desc: 'Gaya ngetik kalian',
            emoji: '⌨️'
        },
        {
            id: 'emoji-personality' as TemplateType,
            name: 'Emoji Personality',
            icon: User,
            desc: 'Kepribadian dari emoji',
            emoji: '😊'
        },
        {
            id: 'ai-prediction' as TemplateType,
            name: 'AI Prediction',
            icon: Sparkles,
            desc: 'Prediksi hubungan 2026',
            emoji: '🔮'
        }
    ];

    const themes = [
        {
            id: 'pastel' as ThemeType,
            name: 'Pastel Light',
            gradient: 'linear-gradient(135deg, #FFE5EC 0%, #FFF0F5 100%)',
            primary: '#FF1B6B'
        },
        {
            id: 'gradient' as ThemeType,
            name: 'Soft Gradient',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            primary: '#667eea'
        },
        {
            id: 'dark' as ThemeType,
            name: 'Night Dark',
            gradient: 'linear-gradient(135deg, #0F0F23 0%, #1A1A2E 100%)',
            primary: '#FF1B6B'
        },
        {
            id: 'minimal' as ThemeType,
            name: 'Minimal Clean',
            gradient: 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)',
            primary: '#000000'
        }
    ];

    // Generate template data from analysis result + Real Chat Stats
    const getTemplateData = (template: TemplateType) => {
        // Real Participants
        const p1 = chatData.participants[0] || 'User 1';
        const p2 = chatData.participants[1] || 'User 2';
        const p1Stats = chatData.participantStats[p1];
        const p2Stats = chatData.participantStats[p2];

        const baseData = {
            relationshipType: analysisResult.relationshipType || 'casual',
            participant1: p1,
            participant2: p2,
        };

        // Type-safe access to analysisResult with fallbacks
        const result = analysisResult as any;

        switch (template) {
            case 'stats':
                return {
                    ...baseData,
                    totalMessages: chatData.totalMessages || 0,
                    totalWords: (p1Stats?.wordCount || 0) + (p2Stats?.wordCount || 0),
                    totalChars: 0, // Not calculated in parser, fallback ok
                    dateRange: chatData.durationString || 'Forever'
                };
            case 'active-day':
                return {
                    ...baseData,
                    mostActiveDay: chatData.busiestDay?.date || 'Unknown',
                    messagesOnThatDay: chatData.busiestDay?.count || 0,
                    peakHour: (chatData.busiestHour !== undefined) ? `${chatData.busiestHour}:00` : '20:00'
                };
            case 'who-talks':
                const total = (p1Stats?.messageCount || 0) + (p2Stats?.messageCount || 0);
                return {
                    ...baseData,
                    percentage1: total ? Math.round((p1Stats.messageCount / total) * 100) : 50,
                    percentage2: total ? Math.round((p2Stats.messageCount / total) * 100) : 50
                };
            case 'late-night':
                return {
                    ...baseData,
                    lateNightHours: '00:00 - 04:00',
                    lateNightMessages: result.lateNightMessages || 456, // Requires specific parser logic or AI
                    mostLateNightDay: result.mostLateNightDay || 'Sabtu'
                };
            case 'peak-moment':
                return {
                    ...baseData,
                    peakPeriod: result.peakPeriod || 'Unknown Period',
                    peakMessages: result.peakMessages || 100,
                    peakTopic: result.peakTopic || 'Life'
                };
            case 'top-words':
                return {
                    ...baseData,
                    topWords: p1Stats?.topWords?.length ? p1Stats.topWords.slice(0, 5) : (result.topWords || []),
                    topWord: p1Stats?.topWords?.[0] || 'Haha',
                    topEmojis: p1Stats?.topEmojis?.length ? p1Stats.topEmojis.slice(0, 5) : (result.topEmojis || [])
                };
            case 'toxic-meter':
                return {
                    ...baseData,
                    toxicScore: result.toxicScore || Math.floor(Math.random() * 30), // AI Only
                    toxicLevel: result.toxicLevel || 'Aman Sentosa',
                    toxicExamples: result.toxicExamples || [],
                    toxicInsight: result.toxicInsight || 'Kalian aman kok, gak toxic!'
                };
            case 'reply-speed':
                return {
                    ...baseData,
                    avgReplyTime1: `${p1Stats?.avgReplyTimeMinutes || 0} menit`,
                    avgReplyTime2: `${p2Stats?.avgReplyTimeMinutes || 0} menit`,
                    fastestReply1: `${p1Stats?.fastestReplyMinutes || 0} menit`,
                    fastestReply2: `${p2Stats?.fastestReplyMinutes || 0} menit`,
                    replyBadge1: (p1Stats?.avgReplyTimeMinutes || 99) < 5 ? '⚡ Kilat' : '🐢 Santai',
                    replyBadge2: (p2Stats?.avgReplyTimeMinutes || 99) < 5 ? '⚡ Kilat' : '🐢 Santai',
                    activeHours1: result.activeHours1 || [],
                    activeHours2: result.activeHours2 || [],
                    replyInsight: result.replyInsight || 'Chat speed kalian seimbang!'
                };
            case 'ghosting':
                return {
                    ...baseData,
                    ghostingCount1: p1Stats?.ghostingCount || 0,
                    ghostingCount2: p2Stats?.ghostingCount || 0,
                    longestGhosting1: `${p1Stats?.longestGhostingDurationMinutes ? Math.round(p1Stats.longestGhostingDurationMinutes / 60) : 0} jam`,
                    longestGhosting2: `${p2Stats?.longestGhostingDurationMinutes ? Math.round(p2Stats.longestGhostingDurationMinutes / 60) : 0} jam`,
                    comebackMessage: result.comebackMessage || 'Maaf baru bales...',
                    ghostingKing: (p1Stats?.ghostingCount || 0) > (p2Stats?.ghostingCount || 0) ? p1 : p2,
                    ghostingInsight: result.ghostingInsight || 'Minim ghosting, good job!'
                };
            case 'topic-ranking':
                return {
                    ...baseData,
                    topTopics: result.topTopics || [], // AI Generated
                    topicInsight: result.topicInsight || 'Topik kalian variatif banget!',
                    mostDebatedTopic: result.mostDebatedTopic || 'Makan dimana'
                };
            case 'quote-year':
                return {
                    ...baseData,
                    bestQuote: result.bestQuote || 'Chat ini seru banget!',
                    quoteAuthor: result.quoteAuthor || p1,
                    quoteDate: result.quoteDate || '2025',
                    quoteContext: result.quoteContext || 'Random chat',
                    runnerUpQuotes: result.runnerUpQuotes || []
                };
            case 'care-meter':
                return {
                    ...baseData,
                    careScore1: result.careScore1 || 50,
                    careScore2: result.careScore2 || 50,
                    careExamples1: result.careExamples1 || [],
                    careExamples2: result.careExamples2 || [],
                    careWinner: result.careWinner || p1,
                    careInsight: result.careInsight || 'Kalian berdua peduli satu sama lain.'
                };
            case 'overthinking':
                return {
                    ...baseData,
                    overthinkingScore1: result.overthinkingScore1 || 20,
                    overthinkingScore2: result.overthinkingScore2 || 20,
                    overthinkingExamples: result.overthinkingExamples || [],
                    overthinkingKing: result.overthinkingKing || p2,
                    overthinkingInsight: result.overthinkingInsight || 'Santai aja, gak usah overthinking!'
                };
            case 'typing-style':
                return {
                    ...baseData,
                    typingStyle1: p1Stats?.typingStyle === 'short' ? 'Singkat Padat' : (p1Stats?.typingStyle === 'long' ? 'Novel Writer' : 'Balanced'),
                    typingStyle2: p2Stats?.typingStyle === 'short' ? 'Singkat Padat' : (p2Stats?.typingStyle === 'long' ? 'Novel Writer' : 'Balanced'),
                    avgMessageLength1: p1Stats?.averageLength || 0,
                    avgMessageLength2: p2Stats?.averageLength || 0,
                    typingSpeed1: (p1Stats?.avgReplyTimeMinutes || 99) < 2 ? 'Cepat' : 'Santai',
                    typingSpeed2: (p2Stats?.avgReplyTimeMinutes || 99) < 2 ? 'Cepat' : 'Santai',
                    styleInsight: result.styleInsight || 'Gaya chat kalian unik!'
                };
            case 'emoji-personality':
                const e1 = p1Stats?.topEmojis?.[0] || '😀';
                const e2 = p2Stats?.topEmojis?.[0] || '😀';
                return {
                    ...baseData,
                    topEmoji1: e1,
                    topEmoji2: e2,
                    emojiCount1: p1Stats?.emojiUsage?.[e1] || 0,
                    emojiCount2: p2Stats?.emojiUsage?.[e2] || 0,
                    personality1: result.personality1 || 'Emoji User',
                    personality2: result.personality2 || 'Emoji User',
                    emojiInsight: result.emojiInsight || 'Emoji kalian menggambarkan mood chat yang asik.'
                };
            case 'ai-prediction':
                return {
                    ...baseData,
                    relationshipScore: result.relationshipScore || 85,
                    futurePredict: result.futurePredict || 'Masa depan cerah!',
                    strengthPoints: result.strengthPoints || ['Komunikasi', 'Trust'],
                    improvementPoints: result.improvementPoints || ['Sering ketemu'],
                    prediction2026: result.prediction2026 || 'Tahun 2026 kalian akan tetap akrab!',
                    aiConfidence: result.aiConfidenceScore || 90
                };
            default:
                return baseData;
        }
    };

    const handleDownloadSingle = async () => {
        setIsDownloading(true);
        setDownloadSuccess(false);

        try {
            // 1. Wait for fonts to load
            await document.fonts.ready;

            // 2. Wait for all images to load
            const images = document.querySelectorAll<HTMLImageElement>('#story-export-hidden img');
            await Promise.all(
                Array.from(images).map((img: HTMLImageElement) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => {
                        img.addEventListener('load', resolve);
                        img.addEventListener('error', resolve);
                    });
                })
            );

            // 3. Get the hidden export element (full size, no transform)
            const exportElement = document.getElementById('story-export-hidden');
            if (!exportElement) throw new Error('Export element not found');

            // 4. Small delay to ensure everything is rendered
            await new Promise(resolve => setTimeout(resolve, 500));

            // 5. Capture with html2canvas at high quality
            const capturedCanvas = await html2canvas(exportElement, {
                scale: 3,                    // 3x for ultra HD
                useCORS: true,
                allowTaint: false,
                backgroundColor: null,
                logging: false,
                width: 1080,
                height: 1920,
                windowWidth: 1080,
                windowHeight: 1920,
                imageTimeout: 0,
                removeContainer: true
            });

            // 6. Convert to JPG with high quality
            capturedCanvas.toBlob((blob) => {
                if (blob) {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
                    const templateName = templates.find(t => t.id === selectedTemplate)?.name.replace(/\s+/g, '-') || 'story';
                    const p1 = chatData.participants[0] || 'UserA';
                    const p2 = chatData.participants[1] || 'UserB';
                    const safeP1 = p1.replace(/[^a-zA-Z0-9]/g, '');
                    const safeP2 = p2.replace(/[^a-zA-Z0-9]/g, '');
                    const fileName = `ChatWrapped_${safeP1}_x_${safeP2}_${templateName}.jpg`;
                    saveAs(blob, fileName);
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 3000);
                }
            }, 'image/jpeg', 0.98); // 98% quality for best result

        } catch (error) {
            console.error('Download error:', error);
            alert('Gagal mendownload story. Silakan coba lagi.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownloadMulti = async () => {
        setIsDownloading(true);
        setDownloadSuccess(false);

        try {
            await document.fonts.ready;
            const zip = new JSZip();

            for (let i = 0; i < templates.length; i++) {
                const templateId = templates[i].id;
                setSelectedTemplate(templateId);
                setCurrentSlide(i);

                // Wait for React render
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Wait for images
                const images = document.querySelectorAll<HTMLImageElement>('#story-export-hidden img');
                await Promise.all(
                    Array.from(images).map((img: HTMLImageElement) => {
                        if (img.complete) return Promise.resolve();
                        return new Promise(resolve => {
                            img.addEventListener('load', resolve);
                            img.addEventListener('error', resolve);
                        });
                    })
                );

                const exportElement = document.getElementById('story-export-hidden');
                if (!exportElement) continue;

                await new Promise(resolve => setTimeout(resolve, 500));

                const capturedCanvas = await html2canvas(exportElement, {
                    scale: 3,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: null,
                    logging: false,
                    width: 1080,
                    height: 1920,
                    windowWidth: 1080,
                    windowHeight: 1920,
                    imageTimeout: 0,
                    removeContainer: true
                });

                const blob = await new Promise<Blob>((resolve) => {
                    capturedCanvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.98);
                });

                zip.file(`${i + 1}-${templates[i].name}.jpg`, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `recapchat-pack-${Date.now()}.zip`);

            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 3000);
        } catch (error) {
            console.error('Download error:', error);
            alert('Gagal mendownload story pack. Silakan coba lagi.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDownload = () => {
        if (downloadMode === 'single') {
            handleDownloadSingle();
        } else {
            handleDownloadMulti();
        }
    };

    const nextSlide = () => {
        const currentIndex = templates.findIndex(t => t.id === selectedTemplate);
        const nextIndex = (currentIndex + 1) % templates.length;
        setSelectedTemplate(templates[nextIndex].id);
        setCurrentSlide(nextIndex);
    };

    const prevSlide = () => {
        const currentIndex = templates.findIndex(t => t.id === selectedTemplate);
        const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
        setSelectedTemplate(templates[prevIndex].id);
        setCurrentSlide(prevIndex);
    };

    const currentTheme = themes.find(t => t.id === selectedTheme);

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-stone-950 flex">
            {/* LEFT SIDEBAR - Fixed Width */}
            <div className="w-[360px] flex-shrink-0 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-stone-900 dark:text-white">
                            Buat Story IG/WA
                        </h2>
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-stone-600 dark:text-stone-400" />
                        </button>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                        Aesthetic & Viral-Friendly
                    </p>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Template Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">✨</span>
                            Pilih Template
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {templates.map((template) => {
                                const Icon = template.icon;
                                const isActive = selectedTemplate === template.id;
                                return (
                                    <button
                                        key={template.id}
                                        onClick={() => {
                                            setSelectedTemplate(template.id);
                                            setCurrentSlide(templates.findIndex(t => t.id === template.id));
                                        }}
                                        className={`
                                            relative p-4 rounded-2xl border-2 transition-all text-left
                                            ${isActive
                                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 shadow-lg shadow-purple-500/20'
                                                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                        <div className="text-2xl mb-2">{template.emoji}</div>
                                        <div className="text-sm font-bold text-stone-900 dark:text-white mb-1">
                                            {template.name}
                                        </div>
                                        <div className="text-xs text-stone-600 dark:text-stone-400 leading-tight">
                                            {template.desc}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">🎨</span>
                            Pilih Tema Warna
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {themes.map((theme) => {
                                const isActive = selectedTheme === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme.id)}
                                        className={`
                                            relative p-3 rounded-xl border-2 transition-all
                                            ${isActive
                                                ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                                                : 'border-stone-200 dark:border-stone-700 hover:border-purple-300 dark:hover:border-purple-700'
                                            }
                                        `}
                                    >
                                        {isActive && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        )}
                                        <div
                                            className="w-full h-12 rounded-lg mb-2"
                                            style={{ background: theme.gradient }}
                                        />
                                        <div className="text-xs font-semibold text-stone-900 dark:text-white text-center">
                                            {theme.name}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Privacy Mode */}
                    <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">🔒</span>
                            Mode Privasi
                        </h3>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={privacyMode.hideNames}
                                    onChange={(e) => setPrivacyMode({ ...privacyMode, hideNames: e.target.checked })}
                                    className="w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-stone-900 dark:text-white">Sembunyikan Nama</div>
                                    <div className="text-xs text-stone-600 dark:text-stone-400">Ganti nama dengan ***</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={privacyMode.blurSensitive}
                                    onChange={(e) => setPrivacyMode({ ...privacyMode, blurSensitive: e.target.checked })}
                                    className="w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-stone-900 dark:text-white">Blur Kata Sensitif</div>
                                    <div className="text-xs text-stone-600 dark:text-stone-400">Blur kata seperti "sayang"</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={privacyMode.safeQuote}
                                    onChange={(e) => setPrivacyMode({ ...privacyMode, safeQuote: e.target.checked })}
                                    className="w-4 h-4 text-purple-500 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-stone-900 dark:text-white">Safe Quote Mode</div>
                                    <div className="text-xs text-stone-600 dark:text-stone-400">Potong quote yang terlalu panjang</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Download Mode */}
                    <div>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                            <span className="text-lg">📦</span>
                            Mode Download
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setDownloadMode('single')}
                                className={`
                                    p-3 rounded-xl border-2 transition-all text-center
                                    ${downloadMode === 'single'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-purple-300 dark:hover:border-purple-700'
                                    }
                                `}
                            >
                                <div className="text-2xl mb-1">📄</div>
                                <div className="text-xs font-semibold text-stone-900 dark:text-white">Single Slide</div>
                                <div className="text-xs text-stone-600 dark:text-stone-400">1 template saja</div>
                            </button>
                            <button
                                onClick={() => setDownloadMode('multi')}
                                className={`
                                    p-3 rounded-xl border-2 transition-all text-center
                                    ${downloadMode === 'multi'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-purple-300 dark:hover:border-purple-700'
                                    }
                                `}
                            >
                                <div className="text-2xl mb-1">📦</div>
                                <div className="text-xs font-semibold text-stone-900 dark:text-white">Multi Pack</div>
                                <div className="text-xs text-stone-600 dark:text-stone-400">Semua template (ZIP)</div>
                            </button>
                        </div>
                    </div>

                    {/* Preview Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-2 mb-3">
                            <Info size={16} className="text-purple-600 dark:text-purple-400 mt-0.5" />
                            <div className="text-xs font-bold text-purple-900 dark:text-purple-100">Preview Info</div>
                        </div>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Template:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100">
                                    {templates.find(t => t.id === selectedTemplate)?.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Tema:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100">
                                    {themes.find(t => t.id === selectedTheme)?.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-purple-700 dark:text-purple-300">Privasi:</span>
                                <span className="font-semibold text-purple-900 dark:text-purple-100">
                                    {Object.values(privacyMode).some(v => v) ? 'Aktif' : 'Tidak Aktif'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Button - Sticky Bottom */}
                <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                    <Button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`
                            w-full !py-4 text-base font-bold transition-all
                            ${downloadSuccess
                                ? '!bg-green-500 hover:!bg-green-600'
                                : '!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700'
                            }
                        `}
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                {downloadMode === 'multi' ? 'Membuat Story Pack...' : 'Membuat Story...'}
                            </>
                        ) : downloadSuccess ? (
                            <>
                                <Check size={20} />
                                Story Berhasil Dibuat!
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                {downloadMode === 'multi' ? 'Download Story Pack (ZIP)' : 'Download Story'}
                            </>
                        )}
                    </Button>
                    <p className="text-xs text-center text-stone-600 dark:text-stone-400 mt-3">
                        {downloadMode === 'multi'
                            ? 'Semua 6 template akan didownload dalam 1 file ZIP'
                            : 'File siap upload ke Instagram Story (1080×1920)'
                        }
                    </p>
                </div>
            </div>

            {/* RIGHT PREVIEW AREA */}
            <div
                className="flex-1 relative overflow-hidden"
                style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)'
                        : currentTheme?.gradient || 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 10s ease infinite'
                }}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                {/* Slide Counter - Top Center */}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-6 py-2.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-full shadow-lg border border-stone-200/50 dark:border-stone-700/50">
                        <span className="text-sm font-bold text-stone-900 dark:text-white">
                            {currentSlide + 1} / {templates.length}
                        </span>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    className="absolute left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-full shadow-xl border border-stone-200/50 dark:border-stone-700/50 hover:scale-110 hover:bg-white dark:hover:bg-stone-800 transition-all"
                >
                    <ChevronLeft size={24} className="text-stone-900 dark:text-white" />
                </button>

                <button
                    onClick={nextSlide}
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-full shadow-xl border border-stone-200/50 dark:border-stone-700/50 hover:scale-110 hover:bg-white dark:hover:bg-stone-800 transition-all"
                >
                    <ChevronRight size={24} className="text-stone-900 dark:text-white" />
                </button>

                {/* Story Preview - Centered with Proper Scaling */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedTemplate + selectedTheme}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="relative"
                            style={{
                                width: '405px',
                                height: '720px'
                            }}
                        >
                            {/* Story Canvas - Fixed 1080x1920, Scaled for Preview */}
                            <div
                                className="origin-top-left overflow-hidden rounded-[32px] shadow-2xl"
                                style={{
                                    width: '1080px',
                                    height: '1920px',
                                    transform: 'scale(0.375)',
                                    transformOrigin: 'top left',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                                }}
                            >
                                <div id="story-canvas-export">
                                    <StoryTemplate
                                        template={selectedTemplate}
                                        theme={selectedTheme}
                                        data={getTemplateData(selectedTemplate)}
                                        privacyMode={privacyMode}
                                    />
                                </div>
                            </div>

                            {/* Template Label - Bottom */}
                            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <div className="px-6 py-2.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-xl rounded-full shadow-lg border border-stone-200/50 dark:border-stone-700/50">
                                    <span className="text-sm font-semibold text-stone-900 dark:text-white">
                                        {templates.find(t => t.id === selectedTemplate)?.name} • {themes.find(t => t.id === selectedTheme)?.name}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Hidden Export Element - Full Size, No Transform */}
                <div
                    id="story-export-hidden"
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        top: 0,
                        width: '1080px',
                        height: '1920px',
                        overflow: 'hidden'
                    }}
                >
                    <StoryTemplate
                        template={selectedTemplate}
                        theme={selectedTheme}
                        data={getTemplateData(selectedTemplate)}
                        privacyMode={privacyMode}
                    />
                </div>
            </div>

            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
        </div>
    );
};
