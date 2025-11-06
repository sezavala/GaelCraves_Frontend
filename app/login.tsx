import React from 'react';
import { Button, StyleSheet, Platform } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useGoogleLogin } from '@/auth/googleAuth';
import { makeRedirectUri } from 'expo-auth-session';
import { PROXY_REDIRECT_URI, NON_PROXY_REDIRECT_URI } from '@/auth/googleAuth';

export default function LoginScreen() {
  const { promptAsync } = useGoogleLogin();

  const proxyUri = PROXY_REDIRECT_URI;
  const nonProxyUri = NON_PROXY_REDIRECT_URI;
  const chosen = Platform.OS === 'web' ? nonProxyUri : proxyUri;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sign in</ThemedText>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
});
