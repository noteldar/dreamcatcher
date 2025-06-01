'use client';

import { ParagraphDocument } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import ParagraphCard from "./ParagraphCard";

interface RightPanelProps {
    initialParagraphs: ParagraphDocument[];
}

const RightPanel: React.FC<RightPanelProps> = ({ initialParagraphs }) => {
    const [processedParagraphs, setProcessedParagraphs] = useState<ParagraphDocument[]>([]);
    const [selectedParagraph, setSelectedParagraph] = useState<ParagraphDocument | null>(null);

    // Simulate the transfer animation by gradually adding paragraphs
    useEffect(() => {
        if (initialParagraphs.length === 0) return;

        // Reset processed paragraphs when initialParagraphs change (new persona selected)
        setProcessedParagraphs([]);

        const interval = setInterval(() => {
            setProcessedParagraphs(prev => {
                if (prev.length < initialParagraphs.length) {
                    return [...prev, initialParagraphs[prev.length]];
                }
                return prev;
            });
        }, 5000); // Wait for full 5-second cycle (3s processing + 2s showing)

        return () => clearInterval(interval);
    }, [initialParagraphs]);

    const handleCardClick = (paragraph: ParagraphDocument) => {
        setSelectedParagraph(paragraph);
    };

    const closeModal = () => {
        setSelectedParagraph(null);
    };

    return (
        <div className="panel-base right-panel" style={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Enhanced Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
                flexShrink: 0
            }}>
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    letterSpacing: '-0.025em'
                }}>
                    <motion.span
                        animate={{
                            background: ['linear-gradient(45deg, #a855f7, #3b82f6)', 'linear-gradient(45deg, #3b82f6, #a855f7)'],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            marginRight: '16px',
                            display: 'block'
                        }}
                    ></motion.span>
                    Emotional Feed
                </h2>
                <div className="feed-badge" style={{
                    color: 'rgba(255, 255, 255, 0.8)'
                }}>
                    {processedParagraphs.length} paragraphs
                </div>
            </div>

            {/* Feed Container */}
            <div style={{
                flex: '1',
                overflow: 'hidden',
                minHeight: '0'
            }}>
                {processedParagraphs.length > 0 ? (
                    <div className="scrollbar-thin" style={{
                        height: '100%',
                        overflowY: 'auto',
                        paddingRight: '24px',
                        paddingLeft: '24px',
                        paddingTop: '16px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}>
                            <AnimatePresence>
                                {processedParagraphs.map((paragraph, index) => (
                                    <motion.div
                                        key={`${paragraph.book}-${paragraph.paragraph_index}-${paragraph.id}-${index}`}
                                        initial={{ opacity: 0, x: 100, scale: 0.9, rotateY: 15 }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                            scale: 1,
                                            rotateY: 0,
                                            transition: {
                                                duration: 0.8,
                                                delay: 0.1,
                                                type: "spring",
                                                stiffness: 150,
                                                damping: 20
                                            }
                                        }}
                                        exit={{
                                            opacity: 0,
                                            x: -100,
                                            scale: 0.9,
                                            rotateY: -15,
                                            transition: { duration: 0.4 }
                                        }}
                                        whileHover={{
                                            scale: 1.02,
                                            y: -4,
                                            transition: { duration: 0.3, type: "spring", stiffness: 400 }
                                        }}
                                        style={{
                                            cursor: 'pointer',
                                            position: 'relative',
                                            transformStyle: 'preserve-3d'
                                        }}
                                        onClick={() => handleCardClick(paragraph)}
                                    >
                                        {/* Enhanced transfer animation effect */}
                                        {index === processedParagraphs.length - 1 && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 1, x: -300, skewX: 12 }}
                                                    animate={{ opacity: 0, x: 100, skewX: 0 }}
                                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), rgba(255,255,255,0.2), rgba(59, 130, 246, 0.3), transparent)',
                                                        borderRadius: '16px',
                                                        pointerEvents: 'none',
                                                        zIndex: 5
                                                    }}
                                                />
                                                <motion.div
                                                    initial={{ scale: 1, opacity: 0.5 }}
                                                    animate={{ scale: 1.1, opacity: 0 }}
                                                    transition={{ duration: 0.8 }}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-4px',
                                                        left: '-4px',
                                                        right: '-4px',
                                                        bottom: '-4px',
                                                        borderRadius: '20px',
                                                        border: '2px solid rgba(139, 92, 246, 0.6)',
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            </>
                                        )}

                                        <ParagraphCard
                                            paragraph={paragraph}
                                            isExpanded={false}
                                            onClick={() => handleCardClick(paragraph)}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Spacer to ensure scrolling works properly */}
                        <div style={{ height: '24px' }}></div>
                    </div>
                ) : (
                    /* Enhanced empty state */
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto',
                                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '24px',
                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid rgba(139, 92, 246, 0.3)',
                                    borderTopColor: '#8b5cf6',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                            </motion.div>
                            <div>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '20px',
                                    marginBottom: '12px',
                                    fontWeight: '600'
                                }}>
                                    Waiting for emotional journey...
                                </p>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '16px',
                                    fontWeight: '400',
                                    lineHeight: '1.5'
                                }}>
                                    Processed paragraphs will appear here as they complete their emotional cycle
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Enhanced footer stats */}
            {processedParagraphs.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        marginTop: '24px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        flexShrink: 0,
                        fontWeight: '500'
                    }}
                >
                    <span>Total emotions: <strong style={{ color: '#a855f7' }}>{new Set(processedParagraphs.map(p => p.emotion)).size}</strong></span>
                    <span>Avg intensity: <strong style={{ color: '#3b82f6' }}>{(processedParagraphs.reduce((sum, p) => sum + p.emotion_level, 0) / processedParagraphs.length).toFixed(1)}</strong></span>
                </motion.div>
            )}

            {/* Modal */}
            {selectedParagraph && (
                <Modal paragraph={selectedParagraph} onClose={closeModal} />
            )}
        </div>
    );
};

export default RightPanel; 
