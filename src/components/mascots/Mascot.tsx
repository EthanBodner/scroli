import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MascotProps, getMascotEmotion } from './types';
import { theme } from '../../theme';

const AnimatedG = Animated.createAnimatedComponent(G);

export const Mascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
  const emotion = getMascotEmotion(usagePercent);
  const rotation = useSharedValue(0);
  const bounce = useSharedValue(0);

  useEffect(() => {
    // Gentle sway animation
    rotation.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(3, { duration: 1500 })
      ),
      -1,
      true
    );

    // Gentle bounce
    bounce.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [rotation, bounce]);

  const animatedProps = useAnimatedProps(() => ({
    transform: `rotate(${rotation.value}) translateY(${bounce.value})`,
  }));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 240 240">
        {/* Shadow */}
        <Ellipse cx="120" cy="220" rx="70" ry="8" fill="black" fillOpacity="0.1" />

        <AnimatedG animatedProps={animatedProps}>
          {/* Body */}
          <Circle cx="120" cy="140" r="60" fill={theme.colors.primary} />

          {/* Eyes based on emotion */}
          {emotion === 'happy' && (
            <>
              <Circle cx="100" cy="130" r="8" fill="#FFFBEB" />
              <Circle cx="140" cy="130" r="8" fill="#FFFBEB" />
              <Circle cx="102" cy="132" r="4" fill="#1F2937" />
              <Circle cx="142" cy="132" r="4" fill="#1F2937" />
            </>
          )}

          {emotion === 'neutral' && (
            <>
              <Circle cx="100" cy="130" r="6" fill="#1F2937" />
              <Circle cx="140" cy="130" r="6" fill="#1F2937" />
            </>
          )}

          {emotion === 'sad' && (
            <>
              {/* X eyes */}
              <Path d="M95 125 L105 135 M105 125 L95 135" stroke="#1F2937" strokeWidth="3" />
              <Path d="M135 125 L145 135 M145 125 L135 135" stroke="#1F2937" strokeWidth="3" />
            </>
          )}

          {/* Mouth based on emotion */}
          {emotion === 'happy' && (
            <Path
              d="M100 150 Q120 165 140 150"
              stroke="#1F2937"
              strokeWidth="3"
              fill="none"
            />
          )}

          {emotion === 'neutral' && (
            <Path d="M100 150 L140 150" stroke="#1F2937" strokeWidth="3" />
          )}

          {emotion === 'sad' && (
            <Path
              d="M100 160 Q120 145 140 160"
              stroke="#1F2937"
              strokeWidth="3"
              fill="none"
            />
          )}

          {/* Sweat drop when in warning state */}
          {usagePercent >= 0.5 && usagePercent < 0.9 && (
            <Path
              d="M155 120 Q157 125 155 130 Q153 125 155 120"
              fill="#60A5FA"
            />
          )}

          {/* Tear when critical */}
          {usagePercent >= 0.9 && (
            <Path
              d="M150 140 Q152 145 150 150 Q148 145 150 140"
              fill="#60A5FA"
            />
          )}
        </AnimatedG>
      </Svg>
    </View>
  );
};
