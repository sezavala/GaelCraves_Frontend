declare module 'expo-auth-session' {
  export function makeRedirectUri(opts?: any): string;
  export const ResponseType: any;
}

declare module 'expo-auth-session/providers/google' {
  export function useAuthRequest(config: any): [any, any, (options?: any) => Promise<any>];
}
