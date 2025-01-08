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
import { AudioManagerProvider } from './timerScreen/audioManagerTimer';

interface SectionBoxProps {
  title: string;
  onPress: () => void;
  customStyle?: StyleProp<ViewStyle>;
  backgroundImage?: any;
}

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
          imageStyle={{ borderRadius: 10 }}
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

interface NavigationButtonProps {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
}

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
    <AudioManagerProvider>
      <ImageBackground
        source={require('../assets/images/backgroundHomepage.png')}
        style={[LAYOUT.container, styles.mainContainer]}
        resizeMode="cover"
      >
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

        <View style={styles.mainContentContainer}>
          {/* Meditasi */}
          <SectionBox
            title="Meditasi."
            onPress={() => router.push('./timerScreen/timerScreen')}
            customStyle={LAYOUT.largeSection}
            backgroundImage={require('../assets/images/meditationBackground.png')}
          />

          <View style={styles.rowSection}>
            {/* Afirmasi harian */}
            <SectionBox
              title="Afirmasi harian."
              onPress={() => router.push('../afirmasiScreen/afirmasiHarianScreen')}
              customStyle={styles.jurnalBox}
              backgroundImage={require('../assets/images/afirmasiHarianBackground.png')}
            />

            {/* Temani tidur */}
            <SectionBox
              title="Temani tidur."
              onPress={() => router.push('/temaniTidurScreen')}
              customStyle={styles.bernapasBox}
              backgroundImage={require('../assets/images/temaniTidurBackground.png')}
            />
          </View>

          {/* Meditasi dengan panduan */}
          <SectionBox
            title="Meditasi dengan panduan."
            onPress={() => router.push('/meditasiDenganPanduanScreen')}
            customStyle={LAYOUT.largeSection}
            backgroundImage={require('../assets/images/meditationPanduanBackground.png')}
          />
        </View>

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

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: 65,
  },
  greetingsContainer: {
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
    padding: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});

export default HomeScreen;