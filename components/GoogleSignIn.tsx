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

  return (
    <Pressable style={style} onPress={() => promptAsync()} disabled={disabled}>
      <Text style={iconStyle}>G</Text>
      <Text style={textStyle}>Google</Text>
    </Pressable>
  );
}
