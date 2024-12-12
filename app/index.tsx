import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index(): null {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the HomeScreen
    router.replace('/homeScreen');
  }, [router]);

  // Return null since this file serves as a redirect
  return null;
}
