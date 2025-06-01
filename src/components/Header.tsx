'use client';

import { motion } from "framer-motion";

const Header = () => {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="header-glow"
            style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
                backdropFilter: 'blur(20px) saturate(150%)',
                borderRadius: '0 0 32px 32px',
                padding: '32px 48px',
                marginBottom: '40px',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                borderTop: 'none',
                position: 'relative'
            }}
        >
            {/* Subtle top border glow */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.6), rgba(59, 130, 246, 0.6), transparent)',
                borderRadius: '0 0 4px 4px'
            }} />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <div>
                    {/* Main logo/title */}
                    <motion.div
                        animate={{
                            background: [
                                'linear-gradient(45deg, #a855f7, #3b82f6)',
                                'linear-gradient(45deg, #3b82f6, #10b981)',
                                'linear-gradient(45deg, #10b981, #f97316)',
                                'linear-gradient(45deg, #f97316, #a855f7)'
                            ]
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            margin: '0 auto 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            position: 'relative'
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                fontSize: '32px',
                                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                            }}
                        >
                            🌙
                        </motion.div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '48px',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #a855f7, #3b82f6, #10b981)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textAlign: 'center',
                            margin: '0 0 16px 0',
                            letterSpacing: '-0.02em',
                            textShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                        }}
                    >
                        Dreamcatcher
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            fontSize: '18px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '500',
                            textAlign: 'center',
                            margin: '0',
                            letterSpacing: '0.025em'
                        }}
                    >
                        Emotional Journey Through Dreams
                    </motion.p>

                    {/* Floating particles effect */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [-20, -40, -20],
                                    opacity: [0.3, 0.8, 0.3],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 3 + i * 0.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: i * 0.5
                                }}
                                style={{
                                    position: 'absolute',
                                    left: `${15 + i * 15}%`,
                                    top: '50%',
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    background: ['#a855f7', '#3b82f6', '#10b981', '#f97316', '#ec4899', '#8b5cf6'][i],
                                    boxShadow: `0 0 10px ${['#a855f7', '#3b82f6', '#10b981', '#f97316', '#ec4899', '#8b5cf6'][i]}`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header; 
