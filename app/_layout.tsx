// _layout.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import SplashScreenComponent from './splashScreen';
import { AudioManagerProvider } from './timerScreen/audioManagerTimer';
import { COLORS, TEXT_STYLES } from './theme';
import type { SvgProps } from 'react-native-svg';

// Import our custom icon components.
import HomeIcon from '../assets/icons/homeIcon';
import JelajahiIcon from '../assets/icons/jelajahiIcon';
import KomunitasIcon from '../assets/icons/komunitasIcon';
import PencapaianIcon from '../assets/icons/pencapaianIcon';

type NavigationButtonProps = {
  label: string;
  Icon: React.FC<SvgProps>;
  isActive: boolean;
  onPress: () => void;
};

const NavigationButton: React.FC<NavigationButtonProps> = ({
  label,
  Icon,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.navigationButton} onPress={onPress}>
      <Icon
        width={30}    // Icon width
        height={30}   // Icon height
        fill={isActive ? COLORS.primary : COLORS.black} // Active icons use COLORS.primary
      />
      <Text
        style={[
          TEXT_STYLES.body,
          styles.navigationButtonText,
          { color: isActive ? COLORS.primary : COLORS.black },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.bottomNavigation}>
      <NavigationButton
        label="Home"
        Icon={HomeIcon}
        isActive={pathname === '/'}
        onPress={() => router.push('/')}
      />
      <View style={styles.divider} />
      <NavigationButton
        label="Jelajahi"
        Icon={JelajahiIcon}
        isActive={pathname === '/jelajahiScreen'}
        onPress={() => router.push('/jelajahiScreen')}
      />
      <View style={styles.divider} />
      <NavigationButton
        label="Komunitas"
        Icon={KomunitasIcon}
        isActive={pathname === '/komunitasScreen'} // Will be active when on komunitasScreen
        onPress={() => router.push('/komunitasScreen')}
      />
      <View style={styles.divider} />
      <NavigationButton
        label="Pancapaian"
        Icon={PencapaianIcon}
        isActive={pathname === '/pencapaianScreen'}
        onPress={() => router.push('/pencapaianScreen')}
      />
    </View>
  );
};

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AudioManagerProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <SplashScreenComponent>
          <View style={styles.container}>
            <View style={styles.content}>
              <Slot />
            </View>
            <BottomNavigation />
          </View>
        </SplashScreenComponent>
      </AudioManagerProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,    // Top padding
    paddingBottom: 10, // Bottom padding
    backgroundColor: 'white', // Navigation background color
  },
  navigationButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navigationButtonText: {
    marginTop: 5,
    fontSize: 10, // Text under the icons is now font size 12
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.background, // Divider color can be adjusted as needed
  },
});
