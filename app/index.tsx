import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { COLORS, LAYOUT, TEXT_STYLES } from './theme';

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

export default function HomeScreen(): JSX.Element {
  const [greeting, setGreeting] = useState<string>('');
  const [quote, setQuote] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) setGreeting('Selamat Pagi');
    else if (currentHour >= 12 && currentHour < 15) setGreeting('Selamat Siang');
    else if (currentHour >= 15 && currentHour < 18) setGreeting('Selamat Sore');
    else setGreeting('Selamat Malam');

    setQuote(getRandomQuote());

    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[LAYOUT.container, { justifyContent: 'space-between', paddingVertical: 20 }]}>
      {/* Top Section: Logo and Greeting */}
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

        {/* Quote */}
        <Text
          style={[
            TEXT_STYLES.body,
            { color: COLORS.black, textAlign: 'left' },
          ]}
        >
          {quote}
        </Text>
      </View>

      {/* Middle Section: Section Boxes */}
      <View>
        <TouchableOpacity
          style={[LAYOUT.section, LAYOUT.largeSection, { marginBottom: 10 }]}
          onPress={() => router.push('/jurnalScreen')}
        >
          <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>Jurnal.</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity
            style={[LAYOUT.section, LAYOUT.smallSection, { marginRight: 5 }]} // Adjust spacing
            onPress={() => router.push('/bernapasScreen')}
          >
            <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>Latihan napas.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[LAYOUT.section, LAYOUT.smallSection, { marginLeft: 5 }]} // Adjust spacing
            onPress={() => router.push('/timerScreen')}
          >
            <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>Meditasi.</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[LAYOUT.section, LAYOUT.largeSection, { marginBottom: 10 }]}
          onPress={() => router.push('/panduanMeditasiScreen')}
        >
          <Text style={[TEXT_STYLES.sectionTitle, { color: COLORS.black }]}>
            Meditasi dengan panduan.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 30,
              backgroundColor: pathname === '/' ? COLORS.primary : COLORS.background,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => router.push('/')}
          >
            <Image
              source={require('../assets/icons/home.png')}
              style={{ width: 24, height: 24, tintColor: COLORS.black }}
            />
            <Text style={[TEXT_STYLES.body, { marginTop: 5, color: COLORS.black }]}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginHorizontal: 30,
              backgroundColor: pathname === '/profileScreen' ? COLORS.primary : COLORS.background,
              borderRadius: 10,
              padding: 10,
            }}
            onPress={() => router.push('/profileScreen')}
          >
            <Image
              source={require('../assets/icons/profile.png')}
              style={{ width: 24, height: 24, tintColor: COLORS.black }}
            />
            <Text style={[TEXT_STYLES.body, { marginTop: 5, color: COLORS.black }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
