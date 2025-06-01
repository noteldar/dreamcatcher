'use client';

import { ParagraphDocument } from "@/types";
import { motion } from "framer-motion";
import { useEffect } from "react";

interface ModalProps {
    paragraph: ParagraphDocument;
    onClose: () => void;
}

// Dynamic color styles based on emotion and intensity
const getEmotionStyles = (emotion: string, emotionLevel: number) => {
    // Base colors for each emotion (at maximum intensity)
    const baseColors = {
        // Happiness variations
        happiness: '#10b981',
        happy: '#10b981',
        joy: '#10b981',
        joyful: '#10b981',

        // Excitement variations
        excitement: '#f97316',
        excited: '#f97316',

        // Sadness variations  
        sadness: '#3b82f6',
        sad: '#3b82f6',

        // Anger variations
        anger: '#ef4444',
        angry: '#ef4444',
        frustration: '#ef4444',
        frustrated: '#ef4444',

        // Fear variations
        fear: '#a855f7',
        afraid: '#a855f7',
        anxiety: '#a855f7',
        anxious: '#a855f7',

        // Surprise variations
        surprise: '#eab308',
        surprised: '#eab308',

        // Other emotions
        disgust: '#14b8a6',
        disgusted: '#14b8a6',
        shame: '#ec4899',
        ashamed: '#ec4899',
        curiosity: '#6366f1',
        curious: '#6366f1',
        disappointment: '#6b7280',
        disappointed: '#6b7280'
    };

    const normalizedEmotion = emotion.toLowerCase().trim();
    const baseColor = baseColors[normalizedEmotion as keyof typeof baseColors] || '#6b7280';

    // Calculate intensity factor with more dramatic scaling (0.05 to 1.0)
    // 1 -> 0.05 (very faint), 5 -> 0.3, 10 -> 1.0 (maximum intensity)
    // Using a quadratic curve for more dramatic differences
    const normalizedLevel = emotionLevel / 10; // 0.1 to 1.0
    const intensityFactor = Math.max(0.05, Math.min(1.0, 0.05 + (normalizedLevel * normalizedLevel * 0.95)));

    // Convert hex to RGB for manipulation
    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 107, g: 114, b: 128 };
    };

    const rgb = hexToRgb(baseColor);

    // Create intensity-based colors
    const borderOpacity = intensityFactor;
    const backgroundOpacity = intensityFactor * 0.15;
    const textOpacity = Math.max(0.3, intensityFactor * 0.8);

    return {
        borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`,
        color: `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, ${textOpacity})`
    };
};

const Modal: React.FC<ModalProps> = ({ paragraph, onClose }) => {
    // Use actual emotion level from database instead of randomized for testing
    const actualEmotionLevel = paragraph.emotion_level || 5; // Fallback to 5 if not set
    const emotionStyle = getEmotionStyles(paragraph.emotion, actualEmotionLevel);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                boxSizing: 'border-box'
            }}
            onClick={handleBackdropClick}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.3
                }}
                className="modal-content"
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
                    borderRadius: '24px',
                    padding: '24px',
                    maxWidth: '90vw',
                    width: '100%',
                    maxHeight: '80vh',
                    minHeight: '300px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    border: `2px solid ${emotionStyle.borderColor}`,
                    boxShadow: `
                        0 40px 80px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.05),
                        0 0 60px ${emotionStyle.borderColor}40,
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                    `,
                    backdropFilter: 'blur(20px) saturate(150%)',
                    position: 'relative',
                    boxSizing: 'border-box'
                }}
            >
                {/* Animated border glow */}
                <motion.div
                    animate={{
                        boxShadow: [
                            `0 0 30px ${emotionStyle.borderColor}40`,
                            `0 0 60px ${emotionStyle.borderColor}60`,
                            `0 0 30px ${emotionStyle.borderColor}40`
                        ]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: '-4px',
                        left: '-4px',
                        right: '-4px',
                        bottom: '-4px',
                        borderRadius: '28px',
                        pointerEvents: 'none'
                    }}
                />

                {/* Close button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '18px',
                        fontWeight: '500',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.2s',
                        zIndex: 10
                    }}
                >
                    ×
                </motion.button>

                {/* Header */}
                <div style={{ marginBottom: '20px', paddingRight: '50px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: 'rgba(255, 255, 255, 0.95)',
                                margin: '0 0 8px 0',
                                letterSpacing: '-0.025em'
                            }}>
                                {paragraph.book}
                            </h2>
                            <div style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontWeight: '500'
                            }}>
                                Paragraph {paragraph.paragraph_index}
                            </div>
                        </div>
                        <div style={{
                            backgroundColor: emotionStyle.backgroundColor,
                            color: emotionStyle.color,
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            border: `1px solid ${emotionStyle.borderColor}`,
                            backdropFilter: 'blur(8px)',
                            flexShrink: 0,
                            alignSelf: 'flex-start'
                        }}>
                            {paragraph.emotion} • Level {Math.ceil(actualEmotionLevel / 2)}
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div style={{ marginBottom: '20px' }}>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.6',
                            color: 'rgba(255, 255, 255, 0.95)',
                            margin: '0',
                            fontWeight: '400'
                        }}
                    >
                        {paragraph.paragraph}
                    </motion.p>
                </div>

                {/* Emotion analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                        paddingTop: '16px',
                        marginTop: '16px'
                    }}
                >
                    <h3 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: emotionStyle.color,
                        margin: '0 0 12px 0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        Emotional Analysis
                    </h3>
                    <p style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.85)',
                        margin: '0 0 16px 0',
                        lineHeight: '1.5',
                        fontStyle: 'italic'
                    }}>
                        {paragraph.justification}
                    </p>

                    {/* Emotion intensity visualization */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: '500'
                        }}>
                            Emotional Intensity:
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            {[1, 2, 3, 4, 5].map((level) => {
                                // Map 1-10 scale to 5 dots: 1-2→1, 3-4→2, 5-6→3, 7-8→4, 9-10→5
                                const mappedLevel = Math.ceil(actualEmotionLevel / 2);
                                const isActive = level <= mappedLevel;

                                return (
                                    <motion.div
                                        key={level}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4 + level * 0.1, type: "spring" }}
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: isActive ?
                                                emotionStyle.borderColor :
                                                'rgba(107, 114, 128, 0.3)',
                                            boxShadow: isActive ?
                                                `0 0 8px ${emotionStyle.borderColor}80` :
                                                'none',
                                            border: `1px solid ${isActive ? emotionStyle.borderColor : 'rgba(107, 114, 128, 0.5)'}`,
                                            transition: 'all 0.3s'
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Modal; 
