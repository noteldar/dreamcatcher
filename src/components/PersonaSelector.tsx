'use client';

import { motion } from "framer-motion";
import { useState } from "react";

interface PersonaSelectorProps {
    personas: string[];
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
    isLoading?: boolean;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({
    personas,
    selectedPersona,
    onPersonaChange,
    isLoading = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (persona: string) => {
        onPersonaChange(persona);
        setIsOpen(false);
    };

    if (isLoading) {
        return (
            <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '280px'
            }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    borderTopColor: '#8b5cf6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '16px',
                    fontWeight: '500'
                }}>
                    Loading personas...
                </span>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', minWidth: '280px' }}>
            {/* Dropdown Button */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    border: '2px solid rgba(139, 92, 246, 0.3)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.2s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px' }}>👤</span>
                    <span>{selectedPersona || 'Select Persona'}</span>
                </div>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ color: '#8b5cf6', fontSize: '18px' }}
                >
                    ▼
                </motion.span>
            </motion.button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '8px',
                            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
                            borderRadius: '16px',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            zIndex: 50,
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}
                        className="scrollbar-thin"
                    >
                        {personas.map((persona, index) => (
                            <motion.button
                                key={persona}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{
                                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                                    x: 4
                                }}
                                onClick={() => handleSelect(persona)}
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    border: 'none',
                                    backgroundColor: selectedPersona === persona ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                                    color: selectedPersona === persona ? '#a5b4fc' : 'rgba(255, 255, 255, 0.9)',
                                    fontSize: '15px',
                                    fontWeight: selectedPersona === persona ? '600' : '500',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    borderRadius: index === 0 ? '16px 16px 0 0' : index === personas.length - 1 ? '0 0 16px 16px' : '0',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span style={{
                                    fontSize: '16px',
                                    opacity: selectedPersona === persona ? 1 : 0.7
                                }}>
                                    🎭
                                </span>
                                {persona}
                                {selectedPersona === persona && (
                                    <span style={{ marginLeft: 'auto', color: '#8b5cf6' }}>✓</span>
                                )}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Click outside to close */}
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 40
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                </>
            )}
        </div>
    );
};

export default PersonaSelector; 
