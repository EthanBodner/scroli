import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { MascotProps, getMascotEmotion } from './types';
import { theme } from '../../theme';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export const WalletMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
  const emotion = getMascotEmotion(usagePercent);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Money opacity animations
  const bill1Opacity = useRef(new Animated.Value(usagePercent < 0.3 ? 1 : 0)).current;
  const bill2Opacity = useRef(new Animated.Value(usagePercent < 0.6 ? 1 : 0)).current;
  const bill3Opacity = useRef(new Animated.Value(usagePercent < 0.9 ? 1 : 0)).current;

  useEffect(() => {
    // Bounce and rotate animations
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

    // Animate money bills based on usage
    Animated.timing(bill1Opacity, {
      toValue: usagePercent < 0.3 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(bill2Opacity, {
      toValue: usagePercent < 0.6 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(bill3Opacity, {
      toValue: usagePercent < 0.9 ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [bounceAnim, rotateAnim, usagePercent, bill1Opacity, bill2Opacity, bill3Opacity]);

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

          {/* Wallet body */}
          <Rect x="80" y="160" width="80" height="50" rx="8" fill="#8B4513" />

          {/* Money bills - animated */}
          <AnimatedRect
            x="85"
            y="140"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            opacity={bill1Opacity}
          />
          <AnimatedRect
            x="90"
            y="135"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            opacity={bill2Opacity}
          />
          <AnimatedRect
            x="95"
            y="130"
            width="70"
            height="25"
            rx="4"
            fill="#10B981"
            opacity={bill3Opacity}
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
        </Svg>
      </Animated.View>
    </View>
  );
};
