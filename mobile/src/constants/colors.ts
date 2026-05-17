export const Colors = {
  // Backgrounds
  bg: '#0A0A0B',
  card: '#141416',
  elevated: '#1C1C1F',
  border: '#2A2A2F',

  // Accent
  gold: '#E8A838',
  goldLight: '#F0BC5E',
  goldDark: '#C4861A',
  red: '#C94B3A',

  // Text
  textPrimary: '#F5F0E8',
  textMuted: '#9A9A9A',
  textSubtle: '#5A5A60',

  // Semantic
  success: '#3DAA6E',
  white: '#FFFFFF',
  black: '#000000',

  // Gradients (used as array in LinearGradient)
  gradientGold: ['#E8A838', '#C4861A'] as const,
  gradientCard: ['rgba(20,20,22,0)', 'rgba(20,20,22,0.95)'] as const,
  gradientOverlay: ['transparent', 'rgba(10,10,11,0.85)'] as const,
} as const;
