
import { useState, useEffect, useRef, useCallback } from 'react';

// Import all audio files from BGM directory
// Using glob import for Vite/Webpack compatibility
const audioModules = import.meta.glob('../src/ChatRecap_BGM/*.mp3', { eager: true, as: 'url' });

// Extract filenames and paths
const audioFiles = Object.entries(audioModules).reduce((acc, [path, url]) => {
    const fileName = path.split('/').pop() || '';
    acc[fileName] = url;
    return acc;
}, {} as Record<string, string>);

// Debug: Log available files
console.log('Available BGM Files:', Object.keys(audioFiles));

type AudioState = 'playing' | 'paused' | 'stopped';

interface UseBackgroundMusicProps {
    initialVolume?: number; // 0.0 to 1.0
    fadeDuration?: number; // in milliseconds
    duckVolume?: number; // Volume during ducking (0.0 to 1.0)
}

export const useBackgroundMusic = ({
    initialVolume = 0.3,
    fadeDuration = 1500,
    duckVolume = 0.1
}: UseBackgroundMusicProps = {}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const duckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackName, setCurrentTrackName] = useState<string | null>(null);
    const [volume, setVolume] = useState(initialVolume);
    const [isMuted, setIsMuted] = useState(false);
    const [userEnabled, setUserEnabled] = useState(false); // User must interact first

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio();
        audio.loop = true;
        audio.volume = 0; // Start at 0 for fade in
        audioRef.current = audio;

        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Handle global volume / mute changes
    useEffect(() => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = 0;
            } else {
                // If currently fading, don't interfere abruptly, but for simplicity:
                // Just set the target volume for now. Real implementations would tween.
                // We will rely on our fade functions to set volume, but if user changes slider:
                if (!duckTimeoutRef.current && !fadeIntervalRef.current) {
                    audioRef.current.volume = volume;
                }
            }
        }
    }, [volume, isMuted]);

    const fadeTo = useCallback((targetVol: number, duration: number = 1000) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        const startVol = audio.volume;
        const diff = targetVol - startVol;
        const steps = 20;
        const stepTime = duration / steps;
        const stepVol = diff / steps;
        let currentStep = 0;

        fadeIntervalRef.current = setInterval(() => {
            currentStep++;
            let newVol = startVol + (stepVol * currentStep);

            // Clamp volume
            newVol = Math.max(0, Math.min(1, newVol));

            audio.volume = newVol;

            if (currentStep >= steps) {
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                fadeIntervalRef.current = null;
                // Ensure exact target
                audio.volume = targetVol;
                if (targetVol === 0) {
                    audio.pause();
                    setIsPlaying(false);
                }
            }
        }, stepTime);
    }, []);

    const playTrack = useCallback((categoryOrFilename: string) => {
        if (!userEnabled || isMuted) return;

        const audio = audioRef.current;
        if (!audio) return;

        // 1. Find the best matching file
        let bestMatch = '';
        const normalizedQuery = categoryOrFilename.toLowerCase().replace(/_/g, ' ');

        // Exact match first (if full filename passed)
        if (audioFiles[categoryOrFilename]) {
            bestMatch = categoryOrFilename;
        } else {
            // Keyword match
            const availableFiles = Object.keys(audioFiles);

            // Priority Mappings based on AnalysisResult types
            if (normalizedQuery.includes('boy')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('boys')) || '';
            else if (normalizedQuery.includes('girl')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('girls')) || '';
            else if (normalizedQuery.includes('family')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('family')) || '';
            else if (normalizedQuery.includes('work') || normalizedQuery.includes('office')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('work')) || '';
            else if (normalizedQuery.includes('roman') || normalizedQuery.includes('crush') || normalizedQuery.includes('love')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('romance')) || '';
            else if (normalizedQuery.includes('toxic') || normalizedQuery.includes('conflict') || normalizedQuery.includes('mystery')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('mystery')) || '';
            else if (normalizedQuery.includes('stranger') || normalizedQuery.includes('unknown')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('stranger')) || '';
            else if (normalizedQuery.includes('party') || normalizedQuery.includes('group')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('party')) || '';
            else if (normalizedQuery.includes('friend') || normalizedQuery.includes('teman')) bestMatch = availableFiles.find(f => f.toLowerCase().includes('friends')) || '';

            // Fallback to "Friends" or "Stranger" if nothing found
            if (!bestMatch) {
                bestMatch = availableFiles.find(f => f.toLowerCase().includes('friends')) || availableFiles[0] || '';
            }
        }

        if (!bestMatch) {
            console.warn('No BGM found for:', categoryOrFilename);
            return;
        }

        // Check if we need to change track
        // If we are already playing this track, just ensure volume is up
        if (currentTrackName === bestMatch && !audio.paused) {
            // Just fade back in if it was fading out?
            fadeTo(volume, fadeDuration);
            return;
        }

        // Prepare to switch
        const switchTrack = () => {
            const url = audioFiles[bestMatch];
            if (!url) return;

            audio.src = url;
            audio.load();

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                    setCurrentTrackName(bestMatch);
                    // Fade in
                    audio.volume = 0;
                    fadeTo(volume, fadeDuration);
                }).catch(error => {
                    console.error("Autoplay prevented:", error);
                    setIsPlaying(false);
                });
            }
        };

        // If already playing something else, fade out first
        if (isPlaying && currentTrackName !== bestMatch) {
            // Fade out old track rapidly then switch
            const fadeOutTime = 800;
            fadeTo(0, fadeOutTime);
            setTimeout(() => {
                switchTrack();
            }, fadeOutTime + 50);
        } else {
            switchTrack();
        }

    }, [userEnabled, isMuted, currentTrackName, isPlaying, volume, fadeDuration, fadeTo]);

    const stop = useCallback(() => {
        if (audioRef.current) {
            fadeTo(0, fadeDuration);
            // Actual pause happens in fadeTo callback
        }
    }, [fadeDuration, fadeTo]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const duck = useCallback(() => {
        if (!audioRef.current || isMuted || !isPlaying) return;

        // Cancel any existing duck restore timer
        if (duckTimeoutRef.current) clearTimeout(duckTimeoutRef.current);
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        // Instant volume drop (or very fast fade)
        audioRef.current.volume = Math.max(0, volume * 0.3); // Drop to 30% of current target volume

        // Restore after delay
        duckTimeoutRef.current = setTimeout(() => {
            fadeTo(volume, 800); // 800ms fade back to normal
            duckTimeoutRef.current = null;
        }, 600); // Wait 600ms before restoring (length of typical SFX)

    }, [isPlaying, isMuted, volume, fadeTo]);

    const enableAudio = useCallback(() => {
        setUserEnabled(true);
        // Resume context if needed (for WebAudio API, but we use HTML5 Audio here)
    }, []);

    return {
        playTrack,
        stop,
        pause,
        duck,
        setVolume,
        setIsMuted,
        enableAudio,
        isPlaying,
        isMuted,
        userEnabled,
        currentTrackName,
        volume
    };
};
