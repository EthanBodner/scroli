import { withSpring, withTiming, Easing } from 'react-native-reanimated';

export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

export const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const bounceConfig = {
  damping: 10,
  stiffness: 100,
  mass: 0.5,
};

export const withSpringAnimation = (value: number) => {
  return withSpring(value, springConfig);
};

export const withTimingAnimation = (value: number) => {
  return withTiming(value, timingConfig);
};
