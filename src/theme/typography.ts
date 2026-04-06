export const typography = {
  // Font family — Poppins loaded via expo-google-fonts
  fontFamily: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    extrabold: 'Poppins_800ExtraBold',
  },

  // Font sizes
  fontSize: {
    display: 72,
    h1: 32,
    h2: 24,
    h3: 20,
    body: 15,
    small: 13,
    tiny: 11,
  },

  // Font weights (fallback when font not loaded)
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
