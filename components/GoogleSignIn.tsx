import React from 'react';
import { Pressable, Text } from 'react-native';
import { useGoogleLogin } from '@/auth/googleAuth';

type Props = {
  style?: any;
  iconStyle?: any;
  textStyle?: any;
};

export default function GoogleSignIn({ style, iconStyle, textStyle }: Props) {
  const { promptAsync, request } = useGoogleLogin();
  const disabled = !request;

  React.useEffect(() => {
    console.log('[GoogleSignIn] request present?', !!request, 'request=', request);
  }, [request]);

  return (
    <Pressable
      testID="google-signin"
      accessibilityLabel="google-signin"
      style={[style, disabled ? { opacity: 0.6 } : undefined]}
      onPress={() => promptAsync()}
      disabled={disabled}
    >
      <Text style={iconStyle}>G</Text>
      <Text style={textStyle}>Google</Text>
    </Pressable>
  );
}
