'use client';

import { ParagraphDocument } from "@/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ParagraphCardProps {
    paragraph: ParagraphDocument;
    isExpanded?: boolean;
    onClick?: () => void;
    disableHover?: boolean;
    scrollable?: boolean;
    onAnimationComplete?: () => void; // Callback when animation is done and should fade away
    onAnimationPhaseChange?: (phase: 'processing' | 'showing' | 'complete') => void; // Callback for phase changes
}

// Animation phases
type AnimationPhase = 'processing' | 'showing' | 'complete';

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

    // Debug logging to see what emotion we're getting
    if (!baseColors[normalizedEmotion as keyof typeof baseColors]) {
        console.log(`⚠️ Unknown emotion: "${emotion}" (normalized: "${normalizedEmotion}")`);
        console.log('Available emotions:', Object.keys(baseColors));
    }

    return {
        borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${borderOpacity})`,
        backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${backgroundOpacity})`,
        // For feed cards, we want a more vibrant background that respects the new faint scaling
        feedBackground: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0.1, intensityFactor * 0.8)})`,
        feedBackgroundSecondary: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0.05, intensityFactor * 0.6)})`,
        color: `rgba(${Math.min(255, rgb.r + 50)}, ${Math.min(255, rgb.g + 50)}, ${Math.min(255, rgb.b + 50)}, ${textOpacity})`
    };
};

const ParagraphCard: React.FC<ParagraphCardProps> = ({
    paragraph,
    isExpanded = false,
    onClick,
    disableHover,
    scrollable,
    onAnimationComplete,
    onAnimationPhaseChange
}) => {
    const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('processing');

    // Generate random emotion level 1-10 for testing (consistent per unique paragraph)
    const getRandomEmotionLevel = (paragraph: ParagraphDocument) => {
        // Create a unique identifier combining multiple fields
        const uniqueId = `${paragraph.book}-${paragraph.paragraph_index}-${paragraph.id}`;
        const hash = uniqueId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return Math.abs(hash % 10) + 1; // 1-10
    };

    const testEmotionLevel = getRandomEmotionLevel(paragraph);
    const emotionStyle = getEmotionStyles(paragraph.emotion, testEmotionLevel);
    const cardClass = isExpanded ? 'emotion-card' : 'feed-card';
    const textClass = isExpanded ? 'emotion-text' : 'feed-text';

    // Animation timing for scrollable cards (left panel)
    useEffect(() => {
        if (!scrollable) return;

        // Initial phase
        if (onAnimationPhaseChange) {
            onAnimationPhaseChange('processing');
        }

        const timer1 = setTimeout(() => {
            setAnimationPhase('showing');
            if (onAnimationPhaseChange) {
                onAnimationPhaseChange('showing');
            }
        }, 3000); // Processing phase: 0-3 seconds

        const timer2 = setTimeout(() => {
            setAnimationPhase('complete');
            if (onAnimationPhaseChange) {
                onAnimationPhaseChange('complete');
            }
            if (onAnimationComplete) {
                onAnimationComplete();
            }
        }, 5000); // Complete phase: 5 seconds total

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [scrollable, onAnimationComplete, onAnimationPhaseChange]);

    // Determine colors based on animation phase
    const getBorderColor = () => {
        if (scrollable && animationPhase === 'processing') {
            return 'rgba(156, 163, 175, 0.5)'; // Gray border during processing
        }
        return isExpanded ? emotionStyle.borderColor : 'rgba(255, 255, 255, 0.1)';
    };

    const getBackgroundStyle = () => {
        if (scrollable && animationPhase === 'processing') {
            return 'linear-gradient(145deg, rgba(75, 85, 99, 0.6), rgba(55, 65, 81, 0.7))'; // Gray background during processing
        }
        return isExpanded
            ? 'linear-gradient(145deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.9))'
            : `linear-gradient(145deg, ${emotionStyle.feedBackground}, ${emotionStyle.feedBackgroundSecondary})`;
    };

    // Show emotion data only when not in processing phase (for scrollable cards)
    const shouldShowEmotionData = !scrollable || animationPhase !== 'processing';

    return (
        <motion.div
            className={`${cardClass}${disableHover ? ' no-hover' : ''}${scrollable ? ' scrollable-thin' : ''}`}
            style={{
                borderColor: getBorderColor(),
                borderWidth: '2px',
                borderStyle: 'solid',
                cursor: onClick ? 'pointer' : 'default',
                background: getBackgroundStyle(),
                // Add height constraints and layout for scrollable cards
                ...(scrollable ? {
                    maxHeight: '500px',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    overflow: 'hidden'
                } : {})
            }}
            whileHover={!disableHover && onClick ? {
                borderColor: isExpanded ? emotionStyle.color : 'rgba(255, 255, 255, 0.3)',
                boxShadow: isExpanded
                    ? `0 20px 40px ${emotionStyle.borderColor}30, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                    : `0 20px 40px ${emotionStyle.borderColor}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
            } : {}}
            onClick={onClick}
            // Fade out animation when complete
            animate={scrollable && animationPhase === 'complete' ? {
                opacity: 0,
                scale: 0.95,
                transition: { duration: 0.5 }
            } : {
                opacity: 1,
                scale: 1
            }}
        >
            {scrollable ? (
                // Scrollable layout for left panel
                <>
                    {/* Fixed header - doesn't scroll */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        flexShrink: 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                margin: '0'
                            }}>
                                {paragraph.book}
                            </h3>
                            <span style={{
                                fontSize: '13px',
                                color: 'rgba(255, 255, 255, 0.6)',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontWeight: '500'
                            }}>
                                Paragraph {paragraph.paragraph_index}
                            </span>
                            {paragraph.persona_name && (
                                <span style={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    fontWeight: '400',
                                    fontStyle: 'italic'
                                }}>
                                    {paragraph.persona_name}
                                </span>
                            )}
                        </div>

                        {/* Emotion badge - only show when not processing */}
                        {shouldShowEmotionData ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundColor: emotionStyle.backgroundColor,
                                    color: emotionStyle.color,
                                    padding: '6px 12px',
                                    borderRadius: '10px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    textTransform: 'capitalize',
                                    border: `1px solid ${emotionStyle.borderColor}80`,
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                {paragraph.emotion} • {Math.ceil(testEmotionLevel / 2)}
                            </motion.div>
                        ) : (
                            // Processing indicator
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    transition: { duration: 2, repeat: Infinity, ease: "linear" }
                                }}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    border: '2px solid rgba(156, 163, 175, 0.3)',
                                    borderTop: '2px solid rgba(156, 163, 175, 0.8)',
                                    borderRadius: '50%'
                                }}
                            />
                        )}
                    </div>

                    {/* Scrollable content area */}
                    <div style={{
                        flex: '1',
                        overflow: 'auto',
                        paddingRight: '8px',
                        marginRight: '-8px'
                    }} className="scrollbar-thin">
                        {/* Main paragraph text */}
                        <div style={{ marginBottom: '24px' }}>
                            <p className={textClass} style={{
                                margin: '0',
                                lineHeight: '1.6',
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}>
                                {paragraph.paragraph}
                            </p>
                        </div>

                        {/* Analysis section - only show when not processing */}
                        {shouldShowEmotionData && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                                    paddingTop: '20px',
                                    marginTop: '20px'
                                }}
                            >
                                <h4 style={{
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: emotionStyle.color,
                                    margin: '0 0 12px 0',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    Emotional Analysis
                                </h4>
                                <p style={{
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    margin: '0',
                                    lineHeight: '1.5',
                                    fontStyle: 'italic'
                                }}>
                                    {paragraph.justification}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Fixed footer - doesn't scroll */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                        flexShrink: 0,
                        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                        paddingTop: '16px'
                    }}>
                        {/* Intensity dots - only show when not processing */}
                        {shouldShowEmotionData ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <span style={{
                                    fontSize: '13px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontWeight: '500'
                                }}>
                                    Intensity:
                                </span>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    {[1, 2, 3, 4, 5].map((level) => {
                                        const mappedLevel = Math.ceil(testEmotionLevel / 2);
                                        const isActive = level <= mappedLevel;

                                        return (
                                            <motion.div
                                                key={level}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ duration: 0.2, delay: 0.3 + (level * 0.05) }}
                                                style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isActive ? emotionStyle.borderColor : 'rgba(107, 114, 128, 0.3)',
                                                    transition: 'all 0.2s',
                                                    boxShadow: isActive ? `0 0 8px ${emotionStyle.borderColor}60` : 'none'
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </motion.div>
                        ) : (
                            // Processing text
                            <motion.div
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    transition: { duration: 1.5, repeat: Infinity }
                                }}
                                style={{
                                    fontSize: '13px',
                                    color: 'rgba(156, 163, 175, 0.8)',
                                    fontWeight: '500',
                                    fontStyle: 'italic'
                                }}
                            >
                                Analyzing emotional content...
                            </motion.div>
                        )}
                    </div>
                </>
            ) : (
                // Original layout for feed cards
                <>
                    {/* Book info header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isExpanded ? '20px' : '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <h3 style={{
                                fontSize: isExpanded ? '16px' : '14px',
                                fontWeight: '600',
                                color: isExpanded ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
                                margin: '0',
                                textShadow: isExpanded ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)'
                            }}>
                                {paragraph.book}
                            </h3>
                            <span style={{
                                fontSize: isExpanded ? '13px' : '11px',
                                color: isExpanded ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.9)',
                                backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontWeight: '500',
                                textShadow: isExpanded ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.5)'
                            }}>
                                Paragraph {paragraph.paragraph_index}
                            </span>
                            {paragraph.persona_name && (
                                <span style={{
                                    fontSize: isExpanded ? '12px' : '10px',
                                    color: isExpanded ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)',
                                    backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                                    padding: '3px 6px',
                                    borderRadius: '4px',
                                    fontWeight: '400',
                                    fontStyle: 'italic',
                                    textShadow: isExpanded ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.5)'
                                }}>
                                    {paragraph.persona_name}
                                </span>
                            )}
                        </div>

                        {/* Emotion badge */}
                        <div style={{
                            backgroundColor: isExpanded
                                ? emotionStyle.backgroundColor
                                : 'rgba(0, 0, 0, 0.4)',
                            color: isExpanded ? emotionStyle.color : '#ffffff',
                            padding: isExpanded ? '6px 12px' : '4px 8px',
                            borderRadius: isExpanded ? '10px' : '8px',
                            fontSize: isExpanded ? '12px' : '10px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            border: isExpanded
                                ? `1px solid ${emotionStyle.borderColor}80`
                                : '1px solid rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(4px)',
                            textShadow: isExpanded ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.7)'
                        }}>
                            {paragraph.emotion} {isExpanded && `• ${Math.ceil(testEmotionLevel / 2)}`}
                        </div>
                    </div>

                    {/* Main paragraph text */}
                    <div style={{ marginBottom: isExpanded ? '24px' : '16px' }}>
                        <p className={textClass} style={{
                            margin: '0',
                            lineHeight: isExpanded ? '1.6' : '1.5',
                            color: isExpanded ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
                            textShadow: isExpanded ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.5)'
                        }}>
                            {isExpanded ? paragraph.paragraph :
                                (paragraph.paragraph.length > 150 ?
                                    paragraph.paragraph.substring(0, 150) + '...' :
                                    paragraph.paragraph)
                            }
                        </p>
                    </div>

                    {/* Analysis section for expanded view */}
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                                paddingTop: '20px',
                                marginTop: '20px'
                            }}
                        >
                            <h4 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: emotionStyle.color,
                                margin: '0 0 12px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                Emotional Analysis
                            </h4>
                            <p style={{
                                fontSize: '14px',
                                color: 'rgba(255, 255, 255, 0.8)',
                                margin: '0',
                                lineHeight: '1.5',
                                fontStyle: 'italic'
                            }}>
                                {paragraph.justification}
                            </p>
                        </motion.div>
                    )}

                    {/* Emotion level indicator */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: isExpanded ? '20px' : '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                fontSize: isExpanded ? '13px' : '11px',
                                color: isExpanded ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                                fontWeight: '500',
                                textShadow: isExpanded ? 'none' : '0 1px 1px rgba(0, 0, 0, 0.5)'
                            }}>
                                Intensity:
                            </span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map((level) => {
                                    // Map 1-10 scale to 5 dots: 1-2→1, 3-4→2, 5-6→3, 7-8→4, 9-10→5
                                    const mappedLevel = Math.ceil(testEmotionLevel / 2);
                                    const isActive = level <= mappedLevel;

                                    return (
                                        <div
                                            key={level}
                                            style={{
                                                width: isExpanded ? '8px' : '6px',
                                                height: isExpanded ? '8px' : '6px',
                                                borderRadius: '50%',
                                                backgroundColor: isActive ?
                                                    (isExpanded ? emotionStyle.borderColor : '#ffffff') :
                                                    (isExpanded ? 'rgba(107, 114, 128, 0.3)' : 'rgba(255, 255, 255, 0.3)'),
                                                transition: 'all 0.2s',
                                                boxShadow: isActive ?
                                                    (isExpanded
                                                        ? `0 0 8px ${emotionStyle.borderColor}60`
                                                        : '0 0 4px rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.3)'
                                                    ) :
                                                    'none'
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        {!isExpanded && onClick && (
                            <span style={{
                                fontSize: '11px',
                                color: '#ffffff',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                textShadow: '0 1px 1px rgba(0, 0, 0, 0.7)'
                            }}>
                                Click to expand
                            </span>
                        )}
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default ParagraphCard; 
