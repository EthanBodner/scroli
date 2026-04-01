import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getIconName = (routeName: string, focused: boolean): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case 'Dashboard':
      return focused ? 'home' : 'home-outline';
    case 'Stats':
      return focused ? 'stats-chart' : 'stats-chart-outline';
    case 'Profile':
      return focused ? 'person' : 'person-outline';
    case 'Settings':
      return focused ? 'settings' : 'settings-outline';
    default:
      return 'home-outline';
  }
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<NavigationProp>();

  const handleCenterPress = () => {
    rootNavigation.navigate('ImpactFlow');
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom,
          height: 64 + insets.bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenter = route.name === 'Center';

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              style={styles.centerButton}
              onPress={handleCenterPress}
            >
              <View style={styles.centerButtonInner}>
                <Ionicons name="hourglass" size={28} color={theme.colors.text.white} />
              </View>
            </Pressable>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={getIconName(route.name, isFocused)}
              size={24}
              color={isFocused ? theme.colors.primary : theme.colors.text.light}
            />
            <Text
              style={[
                styles.label,
                { color: isFocused ? theme.colors.primary : theme.colors.text.light },
                isFocused && styles.labelFocused,
              ]}
            >
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.xs,
    ...theme.shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: theme.typography.fontSize.tiny,
    fontWeight: theme.typography.fontWeight.regular,
  },
  labelFocused: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  centerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    ...theme.shadows.md,
  },
});
