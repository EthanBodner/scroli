export const typography = {
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

  // Font weights
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
