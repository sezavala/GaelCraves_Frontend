// Mock Expo Winter runtime before anything else
global.__ExpoImportMetaRegistry = {
  register: jest.fn(),
};

// Mock structuredClone if not available
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Silence console warnings
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock Expo modules
jest.mock("expo", () => ({
  ...jest.requireActual("expo"),
}));

// Mock Expo Constants
jest.mock("expo-constants", () => ({
  expoConfig: {
    extra: {},
  },
  manifest: {},
}));

// Mock Expo Router
jest.mock("expo-router", () => ({
  Stack: {
    Screen: jest.fn(({ children }) => children),
  },
  Link: jest.fn(({ children }) => children),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }) => React.createElement("View", {}, children),
    SafeAreaProvider: ({ children }) =>
      React.createElement("View", {}, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock expo-status-bar
jest.mock("expo-status-bar", () => ({
  StatusBar: jest.fn(() => null),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(() => Promise.resolve()),
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
}));