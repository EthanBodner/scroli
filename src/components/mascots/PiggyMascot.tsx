import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Rect } from 'react-native-svg';
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
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const PiggyMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
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

  // Cracks appear as usage increases
  const crack1Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0.5, 0.7], [0, 1], 'clamp'),
  }));

  const crack2Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0.7, 0.9], [0, 1], 'clamp'),
  }));

  // Coins disappear as usage increases
  const coin1Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0, 0.3], [1, 0], 'clamp'),
  }));

  const coin2Opacity = useAnimatedProps(() => ({
    opacity: interpolate(usagePercent, [0.3, 0.6], [1, 0], 'clamp'),
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 240 240">
        <Ellipse cx="120" cy="220" rx="70" ry="8" fill="black" fillOpacity="0.1" />

        <AnimatedG animatedProps={animatedPropsGroup}>
          {/* Piggy bank body */}
          <Ellipse cx="120" cy="140" rx="60" ry="50" fill="#FCA5A5" />

          {/* Coin slot */}
          <Rect x="110" y="110" width="20" height="4" fill="#DC2626" />

          {/* Coins floating above (disappear with usage) */}
          <AnimatedCircle cx="90" cy="95" r="8" fill="#FBBF24" animatedProps={coin1Opacity} />
          <AnimatedCircle cx="150" cy="95" r="8" fill="#FBBF24" animatedProps={coin2Opacity} />

          {/* Snout */}
          <Ellipse cx="120" cy="145" rx="20" ry="15" fill="#F87171" />
          <Circle cx="115" cy="145" r="3" fill="#DC2626" />
          <Circle cx="125" cy="145" r="3" fill="#DC2626" />

          {/* Eyes based on emotion */}
          {emotion === 'happy' && (
            <>
              <Circle cx="105" cy="130" r="6" fill="#1F2937" />
              <Circle cx="135" cy="130" r="6" fill="#1F2937" />
            </>
          )}

          {emotion === 'neutral' && (
            <>
              <Circle cx="105" cy="130" r="5" fill="#1F2937" />
              <Circle cx="135" cy="130" r="5" fill="#1F2937" />
            </>
          )}

          {emotion === 'sad' && (
            <>
              <Path d="M102 127 L108 133 M108 127 L102 133" stroke="#1F2937" strokeWidth="2" />
              <Path d="M132 127 L138 133 M138 127 L132 133" stroke="#1F2937" strokeWidth="2" />
            </>
          )}

          {/* Cracks appear when usage is high */}
          <AnimatedPath
            d="M90 140 L80 160 M85 145 L75 155"
            stroke="#DC2626"
            strokeWidth="2"
            animatedProps={crack1Opacity}
          />
          <AnimatedPath
            d="M150 140 L160 160 M155 145 L165 155"
            stroke="#DC2626"
            strokeWidth="2"
            animatedProps={crack2Opacity}
          />

          {/* Legs */}
          <Rect x="90" y="175" width="15" height="20" rx="7" fill="#F87171" />
          <Rect x="135" y="175" width="15" height="20" rx="7" fill="#F87171" />
        </AnimatedG>
      </Svg>
    </View>
  );
};
