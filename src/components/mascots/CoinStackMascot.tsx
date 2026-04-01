import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { MascotProps, getMascotEmotion } from './types';
import { theme } from '../../theme';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

export const CoinStackMascot: React.FC<MascotProps> = ({ size = 240, usagePercent }) => {
  const emotion = getMascotEmotion(usagePercent);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Coin stack animations (collapse as usage increases)
  const coin1Y = useRef(new Animated.Value(185)).current;
  const coin2Y = useRef(new Animated.Value(175)).current;
  const coin3Y = useRef(new Animated.Value(165)).current;
  const coin1Opacity = useRef(new Animated.Value(1)).current;
  const coin2Opacity = useRef(new Animated.Value(1)).current;
  const coin3Opacity = useRef(new Animated.Value(1)).current;

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

    // Animate coin stack collapse based on usage
    const targetCoin1Y = usagePercent > 0.3 ? 195 : 185;
    const targetCoin2Y = usagePercent > 0.6 ? 195 : 175;
    const targetCoin3Y = usagePercent > 0.9 ? 195 : 165;

    Animated.parallel([
      Animated.timing(coin1Y, {
        toValue: targetCoin1Y,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(coin1Opacity, {
        toValue: usagePercent > 0.3 ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(coin2Y, {
        toValue: targetCoin2Y,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(coin2Opacity, {
        toValue: usagePercent > 0.6 ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(coin3Y, {
        toValue: targetCoin3Y,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(coin3Opacity, {
        toValue: usagePercent > 0.9 ? 0 : 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [bounceAnim, rotateAnim, usagePercent, coin1Y, coin2Y, coin3Y, coin1Opacity, coin2Opacity, coin3Opacity]);

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

          {/* Coin stack - collapses as usage increases */}
          <AnimatedEllipse cx="120" cy={coin1Y} rx="30" ry="8" fill="#FBBF24" opacity={coin1Opacity} />
          <AnimatedEllipse cx="120" cy={coin2Y} rx="30" ry="8" fill="#F59E0B" opacity={coin2Opacity} />
          <AnimatedEllipse cx="120" cy={coin3Y} rx="30" ry="8" fill="#FBBF24" opacity={coin3Opacity} />
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
        </Svg>
      </Animated.View>
    </View>
  );
};
