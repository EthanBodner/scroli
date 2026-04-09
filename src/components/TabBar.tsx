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

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  Stats:     { label: 'Stats', icon: 'stats-chart-outline', iconFocused: 'stats-chart' },
  Profile:   { label: 'You', icon: 'person-outline', iconFocused: 'person' },
  Settings:  { label: 'More', icon: 'menu-outline', iconFocused: 'menu' },
};

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const rootNavigation = useNavigation<NavigationProp>();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom, height: 68 + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'Center';

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              style={styles.centerWrap}
              onPress={() => rootNavigation.navigate('ImpactFlow')}
            >
              <View style={styles.centerButton}>
                <Ionicons name="hourglass" size={26} color={theme.colors.text.white} />
              </View>
              <Text style={styles.centerLabel}>Check In</Text>
            </Pressable>
          );
        }

        const config = TAB_CONFIG[route.name] ?? { label: route.name, icon: 'home-outline', iconFocused: 'home' };

        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.tab}
          >
            <Ionicons
              name={isFocused ? config.iconFocused : config.icon}
              size={22}
              color={isFocused ? theme.colors.primary : theme.colors.text.light}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {config.label}
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
    paddingTop: 8,
    ...theme.shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.light,
  },
  labelFocused: {
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 3,
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    ...theme.shadows.md,
  },
  centerLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.semibold,
    color: theme.colors.primary,
  },
});
