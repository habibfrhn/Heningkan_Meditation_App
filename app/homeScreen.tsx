import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  darkBlue: '#0A2647',
  peach: '#FFB4A2',
  white: '#FFFFFF',
  black: '#000000',
  textGray: '#333333',
};

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [greeting, setGreeting] = useState<string>('');
  const [quote, setQuote] = useState<string>('');

  const quotes: string[] = [
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
    "Saat kamu memperlambat langkah, kamu akan mendengar suara hatimu lebih jelas.",
  ];

  useEffect(() => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.quote}>{quote}</Text>

      <View style={styles.box}>
        <View style={styles.textContainer}>
          <Text style={styles.boxTitle}>Berhenti. Tarik Napas. Tenang.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/timerScreen')}
          >
            <Text style={styles.buttonText}>Mulai Meditasi</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/images/homepage/MeditationHomePage.png')}
          style={styles.image}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 30,
    marginTop: 100,
    textAlign: 'left',
  },
  quote: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.textGray,
    textAlign: 'left',
    marginBottom: 10,
  },
  box: {
    backgroundColor: COLORS.peach,
    padding: 20,
    borderRadius: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.black,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});

export default HomeScreen;
