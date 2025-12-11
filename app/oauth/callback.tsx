import { useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Linking from 'expo-linking';

export default function OAuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    console.log('[OAuthCallback] Received params:', params);

    // On web, the params are in the URL
    // On mobile, we need to handle the deep link differently
    if (Platform.OS === 'web') {
      // For web, redirect to login with the params
      const queryString = new URLSearchParams(params as any).toString();
      router.replace(`/login?${queryString}`);
    } else {
      // For native (Android/iOS), trigger deep link to open the app
      const { code, state, error } = params;
      
      if (error) {
        console.error('[OAuthCallback] OAuth error:', error);
        router.replace('/login');
        return;
      }

      if (code) {
        // Construct deep link to open the app with the auth code
        const deepLink = `gaelcraves://oauth?code=${code}${state ? `&state=${state}` : ''}`;
        console.log('[OAuthCallback] Opening deep link:', deepLink);
        
        try {
          const canOpen = await Linking.canOpenURL(deepLink);
          if (canOpen) {
            await Linking.openURL(deepLink);
          } else {
            console.error('[OAuthCallback] Cannot open deep link');
            router.replace('/login');
          }
        } catch (error) {
          console.error('[OAuthCallback] Error opening deep link:', error);
          router.replace('/login');
        }
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
        Completing sign in...
      </Text>
    </View>
  );
}
