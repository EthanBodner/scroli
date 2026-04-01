import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MascotProps, getMascotEmotion } from './types';
import { theme } from '../../theme';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export const CoinStackMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
  const emotion = getMascotEmotion(usagePercent);
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(3, { duration: 1500 })
      ),
      -1,
      true
    );

    bounce.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [rotation, bounce]);

  const animatedPropsGroup = useAnimatedProps(() => ({
    transform: `rotate(${rotation.value}) translateY(${bounce.value})`,
  }));

  // Coin stack collapses as usage increases
  const coin1Offset = useAnimatedProps(() => ({
    cy: interpolate(usagePercent, [0, 0.3], [185, 195]),
    opacity: interpolate(usagePercent, [0, 0.3], [1, 0], 'clamp'),
  }));

  const coin2Offset = useAnimatedProps(() => ({
    cy: interpolate(usagePercent, [0.3, 0.6], [175, 195]),
    opacity: interpolate(usagePercent, [0.3, 0.6], [1, 0], 'clamp'),
  }));

  const coin3Offset = useAnimatedProps(() => ({
    cy: interpolate(usagePercent, [0.6, 0.9], [165, 195]),
    opacity: interpolate(usagePercent, [0.6, 0.9], [1, 0], 'clamp'),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 240 240">
        <Ellipse cx="120" cy="220" rx="70" ry="8" fill="black" fillOpacity="0.1" />

        <AnimatedG animatedProps={animatedPropsGroup}>
          {/* Coin stack - collapses as usage increases */}
          <AnimatedEllipse cx="120" rx="30" ry="8" fill="#FBBF24" animatedProps={coin1Offset} />
          <AnimatedEllipse cx="120" rx="30" ry="8" fill="#F59E0B" animatedProps={coin2Offset} />
          <AnimatedEllipse cx="120" rx="30" ry="8" fill="#FBBF24" animatedProps={coin3Offset} />
          <Ellipse cx="120" cy="195" rx="30" ry="8" fill="#F59E0B" />

          {/* Mascot sitting on coins */}
          <Circle cx="120" cy="120" r="35" fill={theme.colors.primary} />

          {/* Eyes based on emotion */}
          {emotion === 'happy' && (
            <>
              <Circle cx="110" cy="115" r="5" fill="#FFFBEB" />
              <Circle cx="130" cy="115" r="5" fill="#FFFBEB" />
              <Circle cx="111" cy="116" r="3" fill="#1F2937" />
              <Circle cx="131" cy="116" r="3" fill="#1F2937" />
            </>
          )}

          {emotion === 'neutral' && (
            <>
              <Circle cx="110" cy="115" r="4" fill="#1F2937" />
              <Circle cx="130" cy="115" r="4" fill="#1F2937" />
            </>
          )}

          {emotion === 'sad' && (
            <>
              <Path d="M107 112 L113 118 M113 112 L107 118" stroke="#1F2937" strokeWidth="2" />
              <Path d="M127 112 L133 118 M133 112 L127 118" stroke="#1F2937" strokeWidth="2" />
            </>
          )}

          {/* Mouth */}
          {emotion === 'happy' && (
            <Path d="M110 127 Q120 133 130 127" stroke="#1F2937" strokeWidth="2" fill="none" />
          )}
          {emotion === 'neutral' && <Path d="M110 127 L130 127" stroke="#1F2937" strokeWidth="2" />}
          {emotion === 'sad' && (
            <Path d="M110 132 Q120 125 130 132" stroke="#1F2937" strokeWidth="2" fill="none" />
          )}
        </AnimatedG>
      </Svg>
    </View>
  );
};
