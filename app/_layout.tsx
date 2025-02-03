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
        width={22}    // Increased icon width
        height={22}   // Increased icon height
        fill={isActive ? COLORS.primary : COLORS.black}
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
      <NavigationButton
        label="Jelajahi"
        Icon={JelajahiIcon}
        isActive={pathname === '/jelajahiScreen'}
        onPress={() => router.push('/jelajahiScreen')}
      />
      <NavigationButton
        label="Komunitas"
        Icon={KomunitasIcon}
        isActive={pathname === '/komunitasScreen'}
        onPress={() => router.push('/komunitasScreen')}
      />
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
    backgroundColor: 'white', // Set navigation background to white
  },
  navigationButton: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  navigationButtonText: {
    marginTop: 5,
  },
});