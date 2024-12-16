import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, LAYOUT, TEXT_STYLES } from './theme';

// Reusable Navigation Button Component
const NavigationButton = ({ label, icon, isActive, onPress }: any) => (
  <TouchableOpacity
    style={{
      alignItems: 'center',
      marginHorizontal: 30,
      backgroundColor: isActive ? COLORS.primary : 'transparent',
      borderRadius: 10,
      padding: 10,
    }}
    onPress={onPress}
  >
    <Image
      source={icon}
      style={{ width: 24, height: 24, tintColor: COLORS.black }}
    />
    <Text style={[TEXT_STYLES.body, { marginTop: 5, color: COLORS.black }]}>{label}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[LAYOUT.container, { justifyContent: 'space-between', paddingVertical: 20 }]}>
      {/* Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[TEXT_STYLES.heading, { color: COLORS.black }]}>Profile Screen</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <NavigationButton
          label="Home"
          icon={require('../assets/icons/home.png')}
          isActive={pathname === '/'}
          onPress={() => router.push('/')}
        />
        <NavigationButton
          label="Profile"
          icon={require('../assets/icons/profile.png')}
          isActive={pathname === '/profileScreen'}
          onPress={() => router.push('/profileScreen')}
        />
      </View>
    </View>
  );
}
