import React from 'react';
import { Heart, TrendingUp, MessageCircle, Calendar, User, Sparkles, Zap } from 'lucide-react';

export type TemplateType = 'stats' | 'active-day' | 'who-talks' | 'late-night' | 'peak-moment' | 'top-words';
export type ThemeType = 'pastel' | 'gradient' | 'dark' | 'minimal';

export interface StoryTemplateProps {
    template: TemplateType;
    theme: ThemeType;
    data: {
        // Old properties (for backward compatibility)
        title?: string;
        mood?: string;
        moodPercentage?: number;
        topics?: Array<{ name: string; percentage: number }>;
        aura?: { name: string; color: string; description: string };
        quote?: string;
        timeline?: Array<{ phase: string; description: string }>;
        personality?: { type: string; traits: string[] };
        relationshipType?: string;

        // New properties for new templates
        totalMessages?: number;
        totalWords?: number;
        totalChars?: number;
        dateRange?: string;
        mostActiveDay?: string;
        messagesOnThatDay?: number;
        peakHour?: string;
        participant1?: string;
        participant2?: string;
        percentage1?: number;
        percentage2?: number;
        lateNightHours?: string;
        lateNightMessages?: number;
        mostLateNightDay?: string;
        peakPeriod?: string;
        peakMessages?: number;
        peakTopic?: string;
        topWords?: string[];
        topWord?: string;
        topEmojis?: string[];
    };
    privacyMode?: {
        hideNames?: boolean;
        blurSensitive?: boolean;
        hideDates?: boolean;
        safeQuote?: boolean;
    };
}

export const StoryTemplateNew: React.FC<StoryTemplateProps> = ({
    template,
    theme,
    data,
    privacyMode = {}
}) => {
    // Modern theme configurations - Spotify Wrapped inspired
    const themes = {
        pastel: {
            bg: 'linear-gradient(180deg, #FFE5EC 0%, #FFF0F5 100%)',
            primary: '#FF1B6B',
            accent: '#FF6B9D',
            text: '#1A1A1A',
            textLight: '#666666',
            card: 'rgba(255, 255, 255, 0.9)'
        },
        gradient: {
            bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            primary: '#FFFFFF',
            accent: '#FFD700',
            text: '#FFFFFF',
            textLight: 'rgba(255, 255, 255, 0.85)',
            card: 'rgba(255, 255, 255, 0.15)'
        },
        dark: {
            bg: 'linear-gradient(180deg, #0F0F23 0%, #1A1A2E 100%)',
            primary: '#FF1B6B',
            accent: '#00D9FF',
            text: '#FFFFFF',
            textLight: '#B0B0B0',
            card: 'rgba(255, 255, 255, 0.08)'
        },
        minimal: {
            bg: 'linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)',
            primary: '#000000',
            accent: '#FF1B6B',
            text: '#000000',
            textLight: '#666666',
            card: 'rgba(0, 0, 0, 0.04)'
        }
    };

    const currentTheme = themes[theme];

    // Privacy helpers
    const applyPrivacy = (text: string, type: 'name' | 'sensitive' | 'quote') => {
        if (!text) return '';

        if (type === 'name' && privacyMode.hideNames) {
            return text.replace(/\b[A-Z][a-z]+\b/g, '***');
        }

        if (type === 'sensitive' && privacyMode.blurSensitive) {
            const sensitiveWords = ['sayang', 'cinta', 'kangen', 'rindu'];
            let result = text;
            sensitiveWords.forEach(word => {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                result = result.replace(regex, '***');
            });
            return result;
        }

        if (type === 'quote' && privacyMode.safeQuote) {
            return text.substring(0, 50) + '...';
        }

        return text;
    };

    // Base container style - Fixed layout untuk export stability
    const containerStyle: React.CSSProperties = {
        width: '1080px',
        height: '1920px',
        background: currentTheme.bg,
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box'
    };

    // Render different templates
    const renderTemplate = () => {
        switch (template) {
            case 'stats':
                return renderStatsTemplate();
            case 'active-day':
                return renderActiveDayTemplate();
            case 'who-talks':
                return renderWhoTalksTemplate();
            case 'late-night':
                return renderLateNightTemplate();
            case 'peak-moment':
                return renderPeakMomentTemplate();
            case 'top-words':
                return renderTopWordsTemplate();
            default:
                return renderStatsTemplate();
        }
    };

    const renderStatsTemplate = () => (
        <div style={containerStyle}>
            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: '-150px',
                right: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            {/* Header Section - Fixed Height */}
            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Mood<br />Recap
                </h1>
            </div>

            {/* Content Section - Fixed Height */}
            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    {data.mood === 'Happy' ? '😊' : data.mood === 'Calm' ? '😌' : data.mood === 'Excited' ? '🤩' : '💭'}
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.moodPercentage || 75}%
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    {data.mood || 'Happy'}
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Vibe dominan dari obrolan kalian sepanjang waktu
                </p>
            </div>

            {/* Footer Section - Fixed Height */}
            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderActiveDayTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '-150px',
                left: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Most Active<br />Day
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    📅
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.mostActiveDay || '17'}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Juli 2025
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Hari paling ramai ngobrol kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderWhoTalksTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Who Talks<br />More?
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    💬
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    65%
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Si Paling Cerewet
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Siapa yang lebih banyak ngomong
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderLateNightTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.15,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Late Night<br />Talks
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    🌙
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    00:30
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Mode Overthinking
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Chat tengah malam kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderPeakMomentTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                bottom: '-150px',
                left: '-150px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.1,
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Peak<br />Moment
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    ⚡
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.peakMessages || 847}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Pesan Terbanyak
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Puncak intensitas chat kalian
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderTopWordsTemplate = () => (
        <div style={containerStyle}>
            <div style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '700px',
                height: '700px',
                borderRadius: '50%',
                background: currentTheme.accent,
                opacity: 0.08,
                filter: 'blur(100px)',
                zIndex: 0
            }} />

            <div style={{
                height: '280px',
                padding: '100px 90px 0',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    margin: '0',
                    letterSpacing: '-2px'
                }}>
                    Top<br />Words
                </h1>
            </div>

            <div style={{
                height: '1240px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 90px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ fontSize: '180px', marginBottom: '50px', lineHeight: '1' }}>
                    💭
                </div>

                <div style={{
                    fontSize: '140px',
                    fontWeight: '900',
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '30px',
                    lineHeight: '1'
                }}>
                    {data.topWord || 'Haha'}
                </div>

                <h2 style={{
                    fontSize: '56px',
                    fontWeight: '800',
                    color: currentTheme.text,
                    marginBottom: '30px',
                    margin: '0 0 30px 0',
                    lineHeight: '1.2'
                }}>
                    Kata Favorit
                </h2>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    maxWidth: '700px',
                    lineHeight: '1.6',
                    margin: '0'
                }}>
                    Kata yang paling sering muncul
                </p>
            </div>

            <div style={{
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 90px 100px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderTopicTemplate = () => (
        <div style={containerStyle}>
            {/* Header */}
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    letterSpacing: '-2px'
                }}>
                    Top<br />Topics
                </h1>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '40px' }}>
                {(data.topics || [
                    { name: 'Kehidupan Sehari-hari', percentage: 45 },
                    { name: 'Hobi & Minat', percentage: 30 },
                    { name: 'Rencana Masa Depan', percentage: 25 }
                ]).slice(0, 3).map((topic, index) => (
                    <div key={index} style={{
                        background: currentTheme.card,
                        borderRadius: '40px',
                        padding: '50px 60px',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'blur(20px)'
                    }}>
                        {/* Progress bar background */}
                        <div style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${topic.percentage}%`,
                            background: `linear-gradient(90deg, ${currentTheme.primary}20 0%, ${currentTheme.accent}20 100%)`,
                            borderRadius: '40px'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{
                                fontSize: '80px',
                                fontWeight: '900',
                                color: currentTheme.primary,
                                marginBottom: '15px',
                                lineHeight: '1'
                            }}>
                                #{index + 1}
                            </div>
                            <h3 style={{
                                fontSize: '42px',
                                fontWeight: '800',
                                color: currentTheme.text,
                                marginBottom: '20px',
                                lineHeight: '1.2'
                            }}>
                                {applyPrivacy(topic.name, 'sensitive')}
                            </h3>
                            <div style={{
                                fontSize: '64px',
                                fontWeight: '900',
                                background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {topic.percentage}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderAuraTemplate = () => {
        const auraColors = {
            'Calm Blue': { from: '#667eea', to: '#764ba2' },
            'Warm Pink': { from: '#f093fb', to: '#f5576c' },
            'Chaos Orange': { from: '#fa709a', to: '#fee140' },
            'Deep Purple': { from: '#667eea', to: '#764ba2' }
        };

        const currentAura = data.aura || { name: 'Calm Blue', color: '#667eea', description: 'Tenang dan mendukung' };
        const auraGradient = auraColors[currentAura.name as keyof typeof auraColors] || auraColors['Calm Blue'];

        return (
            <div style={containerStyle}>
                {/* Aura Glow Background */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '900px',
                    height: '900px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${auraGradient.from} 0%, ${auraGradient.to} 100%)`,
                    opacity: 0.25,
                    filter: 'blur(120px)'
                }} />

                {/* Header */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ marginBottom: '30px' }}>
                        <span style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: currentTheme.primary,
                            textTransform: 'uppercase',
                            letterSpacing: '3px'
                        }}>
                            YOUR CHAT WRAPPED
                        </span>
                    </div>
                    <h1 style={{
                        fontSize: '72px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        lineHeight: '1.1',
                        marginBottom: '20px',
                        letterSpacing: '-2px'
                    }}>
                        Chat<br />Aura
                    </h1>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {/* Aura Circle */}
                    <div style={{
                        width: '450px',
                        height: '450px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${auraGradient.from} 0%, ${auraGradient.to} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '70px',
                        boxShadow: `0 30px 80px ${auraGradient.from}60`,
                        position: 'relative'
                    }}>
                        <Zap size={140} color="white" strokeWidth={2.5} />

                        {/* Pulse effect */}
                        <div style={{
                            position: 'absolute',
                            inset: '-20px',
                            borderRadius: '50%',
                            border: `3px solid ${auraGradient.from}40`,
                            animation: 'pulse 2s ease-in-out infinite'
                        }} />
                    </div>

                    <h2 style={{
                        fontSize: '68px',
                        fontWeight: '900',
                        color: currentTheme.text,
                        marginBottom: '35px',
                        textAlign: 'center'
                    }}>
                        {currentAura.name}
                    </h2>

                    <p style={{
                        fontSize: '32px',
                        color: currentTheme.textLight,
                        textAlign: 'center',
                        lineHeight: '1.6',
                        maxWidth: '800px',
                        marginBottom: '60px'
                    }}>
                        {currentAura.description}
                    </p>

                    <div style={{
                        padding: '35px 55px',
                        background: currentTheme.card,
                        borderRadius: '35px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <p style={{
                            fontSize: '26px',
                            color: currentTheme.textLight,
                            fontStyle: 'italic',
                            textAlign: 'center'
                        }}>
                            "Kadang chat yang sederhana<br />justru yang paling bikin kangen."
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px 40px',
                        background: currentTheme.card,
                        borderRadius: '100px',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <Sparkles size={24} color={currentTheme.primary} />
                        <span style={{
                            fontSize: '22px',
                            fontWeight: '700',
                            color: currentTheme.text
                        }}>
                            RecapChat.App
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    const renderQuoteTemplate = () => (
        <div style={containerStyle}>
            {/* Header */}
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    letterSpacing: '-2px'
                }}>
                    Quote<br />Highlight
                </h1>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '140px', marginBottom: '60px' }}>💬</div>

                <div style={{
                    background: currentTheme.card,
                    borderRadius: '50px',
                    padding: '70px 80px',
                    backdropFilter: 'blur(20px)',
                    maxWidth: '900px'
                }}>
                    <p style={{
                        fontSize: '48px',
                        fontWeight: '700',
                        color: currentTheme.text,
                        lineHeight: '1.5',
                        textAlign: 'center',
                        fontStyle: 'italic'
                    }}>
                        "{applyPrivacy(data.quote || 'Momen terbaik adalah saat kita bisa ngobrol tanpa harus mikir panjang', 'quote')}"
                    </p>
                </div>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center',
                    marginTop: '50px'
                }}>
                    Salah satu momen memorable<br />dari chat kalian
                </p>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderTimelineTemplate = () => (
        <div style={containerStyle}>
            {/* Header */}
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    letterSpacing: '-2px'
                }}>
                    Timeline<br />Mini
                </h1>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '40px' }}>
                {(data.timeline || [
                    { phase: 'Awal Kenal', description: 'Masih formal dan hati-hati' },
                    { phase: 'Makin Akrab', description: 'Mulai nyaman dan sering chat' },
                    { phase: 'Fase Sekarang', description: 'Udah kayak temen deket banget' }
                ]).map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '50px', marginBottom: '70px', position: 'relative' }}>
                        {/* Timeline line */}
                        {index < (data.timeline?.length || 3) - 1 && (
                            <div style={{
                                position: 'absolute',
                                left: '39px',
                                top: '80px',
                                width: '4px',
                                height: '140px',
                                background: `linear-gradient(180deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                                opacity: 0.3
                            }} />
                        )}

                        {/* Dot */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            fontWeight: '900',
                            color: 'white',
                            boxShadow: `0 10px 30px ${currentTheme.primary}40`
                        }}>
                            {index + 1}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '48px',
                                fontWeight: '800',
                                color: currentTheme.text,
                                marginBottom: '20px',
                                lineHeight: '1.2'
                            }}>
                                {item.phase}
                            </h3>
                            <p style={{
                                fontSize: '32px',
                                color: currentTheme.textLight,
                                lineHeight: '1.5'
                            }}>
                                {applyPrivacy(item.description, 'sensitive')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    const renderPersonalityTemplate = () => (
        <div style={containerStyle}>
            {/* Header */}
            <div>
                <div style={{ marginBottom: '30px' }}>
                    <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: currentTheme.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '3px'
                    }}>
                        YOUR CHAT WRAPPED
                    </span>
                </div>
                <h1 style={{
                    fontSize: '72px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    lineHeight: '1.1',
                    marginBottom: '20px',
                    letterSpacing: '-2px'
                }}>
                    Personality<br />Card
                </h1>
            </div>

            {/* Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '160px', marginBottom: '50px' }}>🎭</div>

                <h2 style={{
                    fontSize: '58px',
                    fontWeight: '900',
                    color: currentTheme.text,
                    marginBottom: '60px',
                    textAlign: 'center',
                    lineHeight: '1.2'
                }}>
                    {data.personality?.type || 'The Supportive Friend'}
                </h2>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '25px',
                    justifyContent: 'center',
                    marginBottom: '50px',
                    maxWidth: '900px'
                }}>
                    {(data.personality?.traits || ['Pendengar Baik', 'Suka Ngasih Saran', 'Humoris']).map((trait, index) => (
                        <div key={index} style={{
                            padding: '25px 45px',
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.accent} 100%)`,
                            color: 'white',
                            borderRadius: '50px',
                            fontSize: '32px',
                            fontWeight: '700',
                            boxShadow: `0 10px 30px ${currentTheme.primary}40`
                        }}>
                            {trait}
                        </div>
                    ))}
                </div>

                <p style={{
                    fontSize: '28px',
                    color: currentTheme.textLight,
                    textAlign: 'center'
                }}>
                    Gaya komunikasi kamu di chat
                </p>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '20px 40px',
                    background: currentTheme.card,
                    borderRadius: '100px',
                    backdropFilter: 'blur(20px)'
                }}>
                    <Sparkles size={24} color={currentTheme.primary} />
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '700',
                        color: currentTheme.text
                    }}>
                        RecapChat.App
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div id="story-template-download">
            {renderTemplate()}
        </div>
    );
};
