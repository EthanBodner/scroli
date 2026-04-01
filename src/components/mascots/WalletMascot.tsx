import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';
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
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const WalletMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
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

  // Money bills opacity based on usage (more usage = fewer bills)
  const bill1Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0, 0.3], [1, 0], 'clamp'),
  }));

  const bill2Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0.3, 0.6], [1, 0], 'clamp'),
  }));

  const bill3Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0.6, 0.9], [1, 0], 'clamp'),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 240 240">
        <Ellipse cx="120" cy="220" rx="70" ry="8" fill="black" fillOpacity="0.1" />

        <AnimatedG animatedProps={animatedPropsGroup}>
          {/* Wallet body */}
          <Rect x="80" y="160" width="80" height="50" rx="8" fill="#8B4513" />

          {/* Money bills */}
          <AnimatedRect
            x="85"
            y="140"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            animatedProps={bill1Opacity}
          />
          <AnimatedRect
            x="90"
            y="135"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            animatedProps={bill2Opacity}
          />
          <AnimatedRect
            x="95"
            y="130"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            animatedProps={bill3Opacity}
          />

          {/* Mascot face */}
          <Circle cx="120" cy="100" r="40" fill={theme.colors.primary} />

          {/* Eyes based on emotion */}
          {emotion === 'happy' && (
            <>
              <Circle cx="110" cy="95" r="5" fill="#FFFBEB" />
              <Circle cx="130" cy="95" r="5" fill="#FFFBEB" />
              <Circle cx="111" cy="96" r="3" fill="#1F2937" />
              <Circle cx="131" cy="96" r="3" fill="#1F2937" />
            </>
          )}

          {emotion === 'neutral' && (
            <>
              <Circle cx="110" cy="95" r="4" fill="#1F2937" />
              <Circle cx="130" cy="95" r="4" fill="#1F2937" />
            </>
          )}

          {emotion === 'sad' && (
            <>
              <Path d="M107 92 L113 98 M113 92 L107 98" stroke="#1F2937" strokeWidth="2" />
              <Path d="M127 92 L133 98 M133 92 L127 98" stroke="#1F2937" strokeWidth="2" />
            </>
          )}

          {/* Mouth */}
          {emotion === 'happy' && (
            <Path d="M110 110 Q120 117 130 110" stroke="#1F2937" strokeWidth="2" fill="none" />
          )}
          {emotion === 'neutral' && <Path d="M110 110 L130 110" stroke="#1F2937" strokeWidth="2" />}
          {emotion === 'sad' && (
            <Path d="M110 115 Q120 108 130 115" stroke="#1F2937" strokeWidth="2" fill="none" />
          )}
        </AnimatedG>
      </Svg>
    </View>
  );
};
