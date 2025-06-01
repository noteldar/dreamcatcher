// Utility for emotion-based color mapping
// Using explicit Tailwind classes to ensure proper JIT compilation

export interface EmotionColorScheme {
    bg: string;
    border: string;
    text: string;
    shadow: string;
    glow: string;
    accent: string;
}

const emotionColorMap: Record<string, EmotionColorScheme> = {
    happiness: {
        bg: "bg-emerald-900/30",
        border: "border-emerald-500",
        text: "text-emerald-300",
        shadow: "shadow-emerald-500/20",
        glow: "shadow-emerald-500/50",
        accent: "bg-emerald-500/20"
    },
    joy: {
        bg: "bg-emerald-900/30",
        border: "border-emerald-500",
        text: "text-emerald-300",
        shadow: "shadow-emerald-500/20",
        glow: "shadow-emerald-500/50",
        accent: "bg-emerald-500/20"
    },
    excitement: {
        bg: "bg-orange-900/30",
        border: "border-orange-500",
        text: "text-orange-300",
        shadow: "shadow-orange-500/20",
        glow: "shadow-orange-500/50",
        accent: "bg-orange-500/20"
    },
    sadness: {
        bg: "bg-blue-900/30",
        border: "border-blue-500",
        text: "text-blue-300",
        shadow: "shadow-blue-500/20",
        glow: "shadow-blue-500/50",
        accent: "bg-blue-500/20"
    },
    anger: {
        bg: "bg-red-900/30",
        border: "border-red-500",
        text: "text-red-300",
        shadow: "shadow-red-500/20",
        glow: "shadow-red-500/50",
        accent: "bg-red-500/20"
    },
    frustration: {
        bg: "bg-red-900/30",
        border: "border-red-500",
        text: "text-red-300",
        shadow: "shadow-red-500/20",
        glow: "shadow-red-500/50",
        accent: "bg-red-500/20"
    },
    fear: {
        bg: "bg-purple-900/30",
        border: "border-purple-500",
        text: "text-purple-300",
        shadow: "shadow-purple-500/20",
        glow: "shadow-purple-500/50",
        accent: "bg-purple-500/20"
    },
    anxiety: {
        bg: "bg-purple-900/30",
        border: "border-purple-500",
        text: "text-purple-300",
        shadow: "shadow-purple-500/20",
        glow: "shadow-purple-500/50",
        accent: "bg-purple-500/20"
    },
    surprise: {
        bg: "bg-yellow-900/30",
        border: "border-yellow-500",
        text: "text-yellow-300",
        shadow: "shadow-yellow-500/20",
        glow: "shadow-yellow-500/50",
        accent: "bg-yellow-500/20"
    },
    disgust: {
        bg: "bg-teal-900/30",
        border: "border-teal-500",
        text: "text-teal-300",
        shadow: "shadow-teal-500/20",
        glow: "shadow-teal-500/50",
        accent: "bg-teal-500/20"
    },
    shame: {
        bg: "bg-pink-900/30",
        border: "border-pink-500",
        text: "text-pink-300",
        shadow: "shadow-pink-500/20",
        glow: "shadow-pink-500/50",
        accent: "bg-pink-500/20"
    },
    curiosity: {
        bg: "bg-indigo-900/30",
        border: "border-indigo-500",
        text: "text-indigo-300",
        shadow: "shadow-indigo-500/20",
        glow: "shadow-indigo-500/50",
        accent: "bg-indigo-500/20"
    }
};

const defaultColors: EmotionColorScheme = {
    bg: "bg-gray-800/50",
    border: "border-gray-500",
    text: "text-gray-300",
    shadow: "shadow-gray-500/20",
    glow: "shadow-gray-500/50",
    accent: "bg-gray-500/20"
};

export function getEmotionColors(emotion: string, level: number): EmotionColorScheme {
    const baseColors = emotionColorMap[emotion.toLowerCase()] || defaultColors;

    // Adjust intensity based on emotion level (1-5)
    if (level <= 2) {
        // Low intensity - more subtle colors
        return {
            ...baseColors,
            bg: baseColors.bg.replace('/30', '/15'),
            shadow: baseColors.shadow.replace('/20', '/10'),
            glow: baseColors.glow.replace('/50', '/30'),
            accent: baseColors.accent.replace('/20', '/10')
        };
    } else if (level >= 4) {
        // High intensity - more vibrant colors
        return {
            ...baseColors,
            bg: baseColors.bg.replace('/30', '/40'),
            shadow: baseColors.shadow.replace('/20', '/30'),
            glow: baseColors.glow.replace('/50', '/70'),
            accent: baseColors.accent.replace('/20', '/30')
        };
    }

    return baseColors;
} 
