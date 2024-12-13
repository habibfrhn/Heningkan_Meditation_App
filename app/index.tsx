import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function Index(): JSX.Element | null {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure the layout is mounted
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Redirect to the HomeScreen once mounted
      router.replace('/homeScreen');
    }
  }, [isMounted, router]);

  return null; // Return null as this is just a redirect file
}
