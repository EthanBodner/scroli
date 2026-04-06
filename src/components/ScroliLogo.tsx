import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';

interface ScroliLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  dark?: boolean;
}

const SIZES = {
  sm: { icon: 28, text: 18, gap: 6 },
  md: { icon: 40, text: 28, gap: 10 },
  lg: { icon: 56, text: 40, gap: 14 },
};

export const WaveIcon: React.FC<{ size: number; color?: string; secondaryColor?: string }> = ({
  size,
  color = colors.primary,
  secondaryColor = colors.primaryLight,
}) => {
  const w = size;
  const h = size * 0.65;

  return (
    <Svg width={w} height={h} viewBox="0 0 56 36">
      {/* Bottom wave — lighter */}
      <Path
        d="M4 26 C10 20, 18 32, 28 26 C38 20, 46 32, 52 26"
        stroke={secondaryColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Top wave — primary */}
      <Path
        d="M4 16 C10 10, 18 22, 28 16 C38 10, 46 22, 52 16"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
};

export const ScroliLogo: React.FC<ScroliLogoProps> = ({
  size = 'md',
  variant = 'full',
  dark = false,
}) => {
  const s = SIZES[size];
  const textColor = dark ? colors.text.white : colors.primary;

  if (variant === 'icon') {
    return (
      <View style={[styles.iconContainer, { width: s.icon * 1.4, height: s.icon * 1.4, borderRadius: s.icon * 0.32 }]}>
        <WaveIcon size={s.icon} color="#FFFFFF" secondaryColor="rgba(255,255,255,0.6)" />
      </View>
    );
  }

  return (
    <View style={[styles.row, { gap: s.gap }]}>
      <WaveIcon size={s.icon} />
      <Text style={[styles.wordmark, { fontSize: s.text, color: textColor }]}>
        scroli
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
