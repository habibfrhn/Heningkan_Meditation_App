import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, LAYOUT, TEXT_STYLES } from './theme';

// 1. Import the AudioManagerProvider from wherever you placed your audioManager.tsx
import { AudioManagerProvider } from './audioManager';

// Reusable Section Box Component
const SectionBox = ({ title, onPress, customStyle }: any) => (
  <TouchableOpacity style={[LAYOUT.section, customStyle]} onPress={onPress}>
    <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>{title}</Text>
  </TouchableOpacity>
);

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
    <Text style={[TEXT_STYLES.body, { marginTop: 5, color: COLORS.black }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function HomeScreen(): JSX.Element {
  const [greeting, setGreeting] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  // Set Greeting
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting('Selamat Pagi');
    else if (currentHour >= 12 && currentHour < 15) setGreeting('Selamat Siang');
    else if (currentHour >= 15 && currentHour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  return (
    // 2. Wrap your entire screen content in AudioManagerProvider:
    <AudioManagerProvider>
      <View
        style={[
          LAYOUT.container,
          { justifyContent: 'space-between', paddingVertical: 20 },
        ]}
      >
        {/* Top Section - Left-aligned Greeting */}
        <View style={{ marginBottom: 5 }}>
          <Text
            style={[
              TEXT_STYLES.heading,
              { textAlign: 'left', color: COLORS.black },
            ]}
          >
            {greeting}
          </Text>
        </View>

        {/* Middle Section */}
        <View>
          {/* Jurnal Box */}
          <SectionBox
            title="Jurnal."
            onPress={() => router.push('/jurnalScreen')}
            customStyle={LAYOUT.largeSection}
          />

          {/* Downward Rectangular Latihan Napas and Meditasi Boxes */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}
          >
            <SectionBox
              title="Latihan napas."
              onPress={() => router.push('/bernapasScreen')}
              customStyle={{
                flex: 1,
                marginRight: 5,
                height: 180,
                borderRadius: 10,
              }}
            />
            <SectionBox
              title="Meditasi."
              onPress={() => router.push('../timerScreen/timerScreen')}
              customStyle={{
                flex: 1,
                marginLeft: 5,
                height: 180,
                borderRadius: 10,
              }}
            />
          </View>

          {/* Meditasi dengan Panduan Box */}
          <SectionBox
            title="Meditasi dengan panduan."
            onPress={() => router.push('/panduanMeditasiScreen')}
            customStyle={LAYOUT.largeSection}
          />
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
    </AudioManagerProvider>
  );
}
