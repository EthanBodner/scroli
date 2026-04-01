import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { MascotProps, getMascotEmotion } from './types';
import { theme } from '../../theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const PiggyMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
  const emotion = getMascotEmotion(usagePercent);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Crack and coin animations
  const crack1Opacity = useRef(new Animated.Value(usagePercent > 0.5 ? 1 : 0)).current;
  const crack2Opacity = useRef(new Animated.Value(usagePercent > 0.7 ? 1 : 0)).current;
  const coin1Opacity = useRef(new Animated.Value(usagePercent < 0.3 ? 1 : 0)).current;
  const coin2Opacity = useRef(new Animated.Value(usagePercent < 0.6 ? 1 : 0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: -3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate cracks and coins
    Animated.timing(crack1Opacity, {
      toValue: usagePercent > 0.5 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(crack2Opacity, {
      toValue: usagePercent > 0.7 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(coin1Opacity, {
      toValue: usagePercent < 0.3 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(coin2Opacity, {
      toValue: usagePercent < 0.6 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [bounceAnim, rotateAnim, usagePercent, crack1Opacity, crack2Opacity, coin1Opacity, coin2Opacity]);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          transform: [
            { translateY: bounceAnim },
            { rotate: rotateAnim.interpolate({
                inputRange: [-3, 3],
                outputRange: ['-3deg', '3deg'],
              })
            },
          ],
        }}
      >
        <Svg width={size} height={size} viewBox="0 0 240 240">
          <Ellipse cx="120" cy="220" rx="70" ry="8" fill="black" fillOpacity="0.1" />

          {/* Piggy bank body */}
          <Ellipse cx="120" cy="140" rx="60" ry="50" fill="#FCA5A5" />

          {/* Coin slot */}
          <Rect x="110" y="110" width="20" height="4" fill="#DC2626" />

          {/* Coins floating above - animated */}
          <AnimatedCircle cx="90" cy="95" r="8" fill="#FBBF24" opacity={coin1Opacity} />
          <AnimatedCircle cx="150" cy="95" r="8" fill="#FBBF24" opacity={coin2Opacity} />

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

          {/* Cracks appear when usage is high - animated */}
          <AnimatedPath
            d="M90 140 L80 160 M85 145 L75 155"
            stroke="#DC2626"
            strokeWidth="2"
            opacity={crack1Opacity}
          />
          <AnimatedPath
            d="M150 140 L160 160 M155 145 L165 155"
            stroke="#DC2626"
            strokeWidth="2"
            opacity={crack2Opacity}
          />

          {/* Legs */}
          <Rect x="90" y="175" width="15" height="20" rx="7" fill="#F87171" />
          <Rect x="135" y="175" width="15" height="20" rx="7" fill="#F87171" />
        </Svg>
      </Animated.View>
    </View>
  );
};
