import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, LAYOUT, TEXT_STYLES } from './theme';

// Quotes List
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
      backgroundColor: isActive ? COLORS.primary : COLORS.background,
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

export default function HomeScreen(): JSX.Element {
  const [greeting, setGreeting] = useState<string>('');
  const [quote, setQuote] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  // Set Greeting and Random Quote
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting('Selamat Pagi');
    else if (currentHour >= 12 && currentHour < 15) setGreeting('Selamat Siang');
    else if (currentHour >= 15 && currentHour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(getRandomQuote());

    const interval = setInterval(() => setQuote(getRandomQuote()), 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[LAYOUT.container, { justifyContent: 'space-between', paddingVertical: 20 }]}>
      {/* Top Section */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Image
            source={require('../assets/images/logo/logo.png')}
            style={{ width: 50, height: 50, tintColor: COLORS.black }}
          />
          <Text style={[TEXT_STYLES.heading, { marginLeft: 15, color: COLORS.black }]}>
            {greeting}
          </Text>
        </View>
        <Text style={[TEXT_STYLES.body, { color: COLORS.black, textAlign: 'left', marginBottom: 10 }]}>
          {quote}
        </Text>
      </View>

      {/* Middle Section */}
      <View>
        <SectionBox title="Jurnal." onPress={() => router.push('/jurnalScreen')} customStyle={LAYOUT.largeSection} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          <SectionBox
            title="Latihan napas."
            onPress={() => router.push('/bernapasScreen')}
            customStyle={{ flex: 1, marginRight: 5 }}
          />
          <SectionBox
            title="Meditasi."
            onPress={() => router.push('/timerScreen')}
            customStyle={{ flex: 1, marginLeft: 5 }}
          />
        </View>
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
  );
}
