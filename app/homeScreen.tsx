// File path: app/homeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';

const COLORS = {
  background: '#f1f2f4',
  white: '#FFFFFF',
  black: '#000000',
};

const quotes = [
  "Hidup sehat dimulai dari pikiran yang tenang dan hati yang bahagia.",
  "Rawat tubuhmu seperti rumah, karena di sanalah jiwamu tinggal.",
  "Istirahat bukan kemalasan, tapi bagian dari merawat diri.",
  "Kesehatan adalah investasi terbaik yang bisa kamu lakukan.",
  "Jangan lupa tersenyum. Itu latihan kecil untuk jiwa yang bahagia.",
  "Setiap langkah kecil menuju hidup sehat adalah pencapaian besar.",
  "Kamu pantas merasa baik, secara fisik dan emosional.",
  "Diam bukan berarti kosong, tapi ruang untuk mendengarkan jiwa.",
  "Dalam hening, kamu menemukan dirimu yang sebenarnya.",
  "Tarik napas dalam-dalam, lepaskan perlahan. Di sanalah kedamaian dimulai.",
  "Meditasi adalah perjalanan pulang ke dalam diri.",
  "Pikiran yang tenang adalah kunci untuk melihat dunia dengan jernih.",
  "Saat dunia terasa berat, pejamkan mata dan temukan kedamaian di dalam diri.",
  "Lepaskan yang tidak bisa kamu kendalikan dan biarkan hidup mengalir.",
  "Saat kamu memperlambat langkah, kamu akan mendengar suara hatimu lebih jelas."
];

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [greeting, setGreeting] = useState<string>('');
  const [quote, setQuote] = useState<string>('');
  const [fontLoaded, setFontLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Gilroy-Regular': require('../assets/fonts/Gilroy-Regular.ttf'),
      });
      setFontLoaded(true);
    };

    loadFont();

    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Selamat Pagi');
    } else if (currentHour >= 12 && currentHour < 15) {
      setGreeting('Selamat Siang');
    } else if (currentHour >= 15 && currentHour < 18) {
      setGreeting('Selamat Sore');
    } else {
      setGreeting('Selamat Malam');
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>; // Show a loading state while the font is being loaded
  }

  const handleNavigation = () => {
    router.push('/timerScreen');
  };

  return (
    <View style={styles.container}>
      {/* Logo and Greeting */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/logo/logo.png')} // Corrected path
          style={styles.logo}
        />
        <Text style={styles.greeting}>{greeting}</Text>
      </View>

      {/* Quote */}
      <Text style={styles.quote}>{quote}</Text>

      {/* Section Boxes */}
      <View style={styles.sections}>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.section, styles.largeSection]} onPress={handleNavigation}>
            <Text style={styles.sectionTitle}>Jurnal.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.section, styles.smallSection]} onPress={handleNavigation}>
            <Text style={styles.sectionTitle}>Bernapas.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.section, styles.smallSection]} onPress={handleNavigation}>
            <Text style={styles.sectionTitle}>Meditasi.</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.section, styles.largeSection]} onPress={handleNavigation}>
            <Text style={styles.sectionTitle}>Afirmasi.</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleNavigation}>
          <Image
            source={require('../assets/icons/home.png')} // Corrected path
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleNavigation}>
          <Image
            source={require('../assets/icons/profile.png')} // Corrected path
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: 'Gilroy-Regular',
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'left',
    fontFamily: 'Gilroy-Regular',
  },
  sections: {
    flex: 1,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    padding: 10,
  },
  largeSection: {
    width: '100%',
    height: 150,
  },
  smallSection: {
    width: '48%',
    height: 150,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    fontFamily: 'Gilroy-Regular',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: COLORS.black,
    fontFamily: 'Gilroy-Regular',
  },
});

export default HomeScreen;
