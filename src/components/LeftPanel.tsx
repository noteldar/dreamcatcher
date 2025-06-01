'use client';

import { ParagraphDocument } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ParagraphCard from "./ParagraphCard";

interface LeftPanelProps {
    paragraphs: ParagraphDocument[];
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

const LeftPanel: React.FC<LeftPanelProps> = ({ paragraphs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentAnimationPhase, setCurrentAnimationPhase] = useState<'processing' | 'showing' | 'complete'>('processing');

    useEffect(() => {
        if (paragraphs.length === 0) return;

        // Reset state when paragraphs change (new persona selected)
        setCurrentIndex(0);
        setIsComplete(false);
        setCurrentAnimationPhase('processing');

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + 1;
                if (nextIndex >= paragraphs.length) {
                    setIsComplete(true);
                    clearInterval(interval);
                    return prevIndex; // Stay at the last index
                }
                // Reset to processing phase when moving to next paragraph
                setCurrentAnimationPhase('processing');
                return nextIndex;
            });
        }, 5000); // Full 5-second cycle per paragraph

        return () => clearInterval(interval);
    }, [paragraphs]);

    if (paragraphs.length === 0) {
        return (
            <div className="panel-base left-panel">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    textAlign: 'center'
                }}>
                    <div>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '3px solid rgba(139, 92, 246, 0.3)',
                            borderTopColor: '#8b5cf6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 24px'
                        }}></div>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '18px',
                            fontWeight: '500'
                        }}>Loading emotional journey...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show completion state after all paragraphs are done
    if (isComplete) {
        return (
            <div className="panel-base left-panel" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    }}>
                        <span style={{ fontSize: '48px' }}>✨</span>
                    </div>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '16px',
                        letterSpacing: '-0.025em'
                    }}>
                        Journey Complete
                    </h3>
                    <p style={{
                        fontSize: '16px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.5',
                        maxWidth: '300px'
                    }}>
                        All emotional moments have been experienced and transferred to your feed
                    </p>
                </motion.div>
            </div>
        );
    }

    const currentParagraph = paragraphs[currentIndex];

    // Use actual emotion level from database instead of randomized for testing
    const actualEmotionLevel = currentParagraph.emotion_level || 5; // Fallback to 5 if not set
    const emotionStyle = getEmotionStyles(currentParagraph.emotion, actualEmotionLevel);

    // Gray styles for processing phase
    const grayStyle = {
        borderColor: 'rgba(156, 163, 175, 0.5)',
        backgroundColor: 'rgba(75, 85, 99, 0.3)',
        color: 'rgba(156, 163, 175, 0.8)'
    };

    // Use gray styles during processing, emotion styles during showing
    const currentStyle = currentAnimationPhase === 'processing' ? grayStyle : emotionStyle;

    const handleAnimationPhaseChange = (phase: 'processing' | 'showing' | 'complete') => {
        setCurrentAnimationPhase(phase);
    };

    return (
        <div className="panel-base left-panel" style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Floating emotion indicator */}
            <div style={{
                position: 'absolute',
                top: '32px',
                right: '32px',
                zIndex: 20
            }}>
                {currentAnimationPhase === 'processing' ? (
                    // Processing indicator
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="emotion-badge"
                        style={{
                            backgroundColor: grayStyle.backgroundColor,
                            borderColor: grayStyle.borderColor,
                            color: grayStyle.color,
                            border: `1px solid ${grayStyle.borderColor}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <motion.div
                            animate={{
                                rotate: 360,
                                transition: { duration: 2, repeat: Infinity, ease: "linear" }
                            }}
                            style={{
                                width: '12px',
                                height: '12px',
                                border: '2px solid rgba(156, 163, 175, 0.3)',
                                borderTop: '2px solid rgba(156, 163, 175, 0.8)',
                                borderRadius: '50%'
                            }}
                        />
                        Processing...
                    </motion.div>
                ) : (
                    // Emotion badge
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="emotion-badge"
                        style={{
                            backgroundColor: emotionStyle.backgroundColor,
                            borderColor: emotionStyle.borderColor,
                            color: emotionStyle.color,
                            border: `1px solid ${emotionStyle.borderColor}`
                        }}
                    >
                        {currentParagraph.emotion} • Level {Math.ceil(actualEmotionLevel / 2)}
                    </motion.div>
                )}
            </div>

            {/* Main card container - centered */}
            <div style={{
                flex: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                position: 'relative',
                maxHeight: 'calc(100vh - 200px)', // Reserve space for emotion badge and progress indicator
                overflow: 'hidden' // Prevent container overflow
            }}>
                {/* Enhanced background glow effect */}
                <motion.div
                    animate={{
                        background: `radial-gradient(circle at center, ${currentStyle.backgroundColor} 0%, transparent 70%)`
                    }}
                    transition={{ duration: 0.8 }}
                    style={{
                        position: 'absolute',
                        top: '10%',
                        left: '10%',
                        right: '10%',
                        bottom: '10%',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        opacity: 0.8
                    }}
                />

                <div style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '100%', // Respect parent container height
                    overflow: 'hidden' // Prevent this container from overflowing
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${currentParagraph.book}-${currentParagraph.paragraph_index}-${currentParagraph.id}-${currentIndex}`}
                            initial={{ opacity: 0, scale: 0.85, y: 60 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: -60 }}
                            transition={{
                                duration: 0.8,
                                type: "spring",
                                stiffness: 120,
                                damping: 15
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            {/* Enhanced animated border glow */}
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 20px ${currentStyle.borderColor}60`,
                                        `0 0 40px ${currentStyle.borderColor}80`,
                                        `0 0 20px ${currentStyle.borderColor}60`
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    left: '-8px',
                                    right: '-8px',
                                    bottom: '-8px',
                                    borderRadius: '24px',
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: currentStyle.borderColor,
                                    pointerEvents: 'none'
                                }}
                            />

                            {/* Card content with scroll */}
                            <div style={{
                                position: 'relative',
                                flex: '1',
                                overflow: 'auto', // Make the card content scrollable
                                maxHeight: '100%'
                            }}>
                                <ParagraphCard
                                    paragraph={currentParagraph}
                                    isExpanded={true}
                                    disableHover={true}
                                    scrollable={true}
                                    onAnimationPhaseChange={handleAnimationPhaseChange}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Enhanced progress indicator */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                paddingBottom: '16px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                }}>
                    {paragraphs.map((paragraph, index) => {
                        const paragraphEmotionLevel = paragraph.emotion_level || 5;
                        const paragraphEmotionStyle = getEmotionStyles(paragraph.emotion, paragraphEmotionLevel);

                        // Determine color based on state
                        let dotColor;
                        if (index < currentIndex) {
                            // Completed paragraphs - use their emotion color
                            dotColor = paragraphEmotionStyle.borderColor;
                        } else if (index === currentIndex) {
                            // Current paragraph - use gray during processing, emotion color during showing
                            dotColor = currentAnimationPhase === 'processing' ? 'rgba(156, 163, 175, 0.8)' : paragraphEmotionStyle.borderColor;
                        } else {
                            // Future paragraphs - always gray
                            dotColor = 'rgba(107, 114, 128, 0.5)';
                        }

                        return (
                            <motion.div
                                key={index}
                                className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
                                animate={{
                                    backgroundColor: dotColor,
                                    scale: index === currentIndex ? 1.2 : 1,
                                    opacity: index <= currentIndex ? 1 : 0.6
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        );
                    })}
                </div>
                <p style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '500'
                }}>
                    {currentIndex + 1} of {paragraphs.length}
                </p>
            </div>
        </div>
    );
};

export default LeftPanel; 
