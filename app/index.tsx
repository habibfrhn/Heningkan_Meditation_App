// index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, LAYOUT, TEXT_STYLES } from './theme';

// Import the AudioManagerProvider from wherever you placed your audioManager.tsx
import { AudioManagerProvider } from './audioManager';

/**
 * Props interface for SectionBox component
 */
interface SectionBoxProps {
  title: string;
  onPress: () => void;
  customStyle?: StyleProp<ViewStyle>;
  backgroundImage?: any; // Optional prop for background image
}

/**
 * Reusable Section Box Component
 */
const SectionBox: React.FC<SectionBoxProps> = ({
  title,
  onPress,
  customStyle,
  backgroundImage,
}) => {
  return (
    <TouchableOpacity style={[LAYOUT.section, customStyle]} onPress={onPress}>
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 10 }} // Match the border radius if needed
        >
          <View style={styles.contentContainer}>
            <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>
              {title}
            </Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Props interface for NavigationButton component
 */
interface NavigationButtonProps {
  label: string;
  icon: any; // You can replace any with a more specific type if needed, e.g., ImageSourcePropType
  isActive: boolean;
  onPress: () => void;
}

/**
 * Reusable Navigation Button Component
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  icon,
  isActive,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.navigationButton,
      { backgroundColor: isActive ? COLORS.primary : 'transparent' },
    ]}
    onPress={onPress}
  >
    <Image
      source={icon}
      style={{ width: 24, height: 24, tintColor: COLORS.black }}
    />
    <Text style={[TEXT_STYLES.body, styles.navigationButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

/**
 * HomeScreen Component
 */
const HomeScreen: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  // Set Greeting based on current hour
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting('Selamat Pagi');
    else if (currentHour >= 12 && currentHour < 15) setGreeting('Selamat Siang');
    else if (currentHour >= 15 && currentHour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');
  }, []);

  return (
    // Wrap your entire screen content in AudioManagerProvider
    <AudioManagerProvider>
      {/* Main Container with ImageBackground */}
      <ImageBackground
        source={require('../assets/images/backgroundHomepage.png')}
        style={[LAYOUT.container, styles.mainContainer]}
        resizeMode="cover" // Optional: Adjust how the image is resized
      >
        {/* Greetings Container */}
        <View style={styles.greetingsContainer}>
          <Text
            style={[
              TEXT_STYLES.heading,
              { textAlign: 'left', color: COLORS.black },
            ]}
          >
            {greeting}
          </Text>
        </View>

        {/* Main Content Container */}
        <View style={styles.mainContentContainer}>
          {/* Meditasi Box with Background Image */}
          <SectionBox
            title="Meditasi."
            onPress={() => router.push('./timerScreen/timerScreen')} // Updated navigation
            customStyle={LAYOUT.largeSection}
            backgroundImage={require('../assets/images/meditationBackground.png')} // Added background image
          />

          {/* Downward Rectangular Jurnal and Latihan Napas Boxes */}
          <View style={styles.rowSection}>
            <SectionBox
              title="Jurnal."
              onPress={() => router.push('/jurnalScreen')}
              customStyle={styles.jurnalBox}
            />
            <SectionBox
              title="Latihan napas."
              onPress={() => router.push('/bernapasScreen')}
              customStyle={styles.bernapasBox}
            />
          </View>

          {/* Meditasi dengan Panduan Box (also using LAYOUT.largeSection) */}
          <SectionBox
            title="Meditasi dengan panduan."
            onPress={() => router.push('/panduanMeditasiScreen')}
            customStyle={LAYOUT.largeSection}
            backgroundImage={require('../assets/images/meditationPanduanBackground.png')}
          />
        </View>

        {/* Bottom Navigation Container */}
        <View style={styles.bottomNavigation}>
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
      </ImageBackground>
    </AudioManagerProvider>
  );
};

/**
 * Stylesheet for additional styling
 */
const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: 65, // Added padding to ensure enough space from the top
  },
  greetingsContainer: {
    // Additional styling if needed
    paddingTop: 0,
  },
  mainContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  jurnalBox: {
    flex: 1,
    marginRight: 5,
    height: 180,
    borderRadius: 10,
  },
  bernapasBox: {
    flex: 1,
    marginLeft: 5,
    height: 180,
    borderRadius: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navigationButton: {
    alignItems: 'center',
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 10,
  },
  navigationButtonText: {
    marginTop: 5,
    color: COLORS.black,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    padding: 10, // Padding here so the image can fully fill its container
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default HomeScreen;
