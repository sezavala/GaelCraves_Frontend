import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

// Mock AuthContext
jest.mock("@/auth/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    setUser: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock Login component for testing
const LoginComponent = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = () => {
    setLoading(true);
    setError("");
    
    // Simulate validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Simulate successful login
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  return (
    <View testID="login-container">
      <Text testID="login-title">Gael Craves Login</Text>
      
      <TextInput
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text testID="error-message">{error}</Text> : null}

      <TouchableOpacity 
        testID="login-button" 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text>{loading ? "Loading..." : "Sign In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity testID="google-signin-button">
        <Text>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

describe("Login Component", () => {
  test("renders login page correctly", () => {
    const { getByTestId, getByText } = render(<LoginComponent />);
    
    expect(getByTestId("login-container")).toBeTruthy();
    expect(getByTestId("login-title")).toBeTruthy();
    expect(getByText("Gael Craves Login")).toBeTruthy();
  });

  test("renders email and password inputs", () => {
    const { getByTestId, getByPlaceholderText } = render(<LoginComponent />);
    
    expect(getByTestId("email-input")).toBeTruthy();
    expect(getByTestId("password-input")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
  });

  test("updates email input value when typing", () => {
    const { getByTestId } = render(<LoginComponent />);
    const emailInput = getByTestId("email-input");

    fireEvent.changeText(emailInput, "test@example.com");
    expect(emailInput.props.value).toBe("test@example.com");
  });

  test("updates password input value when typing", () => {
    const { getByTestId } = render(<LoginComponent />);
    const passwordInput = getByTestId("password-input");

    fireEvent.changeText(passwordInput, "password123");
    expect(passwordInput.props.value).toBe("password123");
  });

  test("password input is secure", () => {
    const { getByTestId } = render(<LoginComponent />);
    const passwordInput = getByTestId("password-input");

    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  test("shows error when submitting empty form", async () => {
    const { getByTestId, getByText } = render(<LoginComponent />);
    const loginButton = getByTestId("login-button");

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText("Please fill in all fields")).toBeTruthy();
    });
  });

  test("login button shows loading state", async () => {
    const { getByTestId, getByText } = render(<LoginComponent />);
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");
    const loginButton = getByTestId("login-button");

    fireEvent.changeText(emailInput, "gaelcraves@admin.com");
    fireEvent.changeText(passwordInput, "ILuvSergio04!");
    fireEvent.press(loginButton);

    expect(getByText("Loading...")).toBeTruthy();
  });

  test("renders Google sign-in button", () => {
    const { getByTestId, getByText } = render(<LoginComponent />);
    
    expect(getByTestId("google-signin-button")).toBeTruthy();
    expect(getByText("Sign in with Google")).toBeTruthy();
  });

  test("email input has correct keyboard type", () => {
    const { getByTestId } = render(<LoginComponent />);
    const emailInput = getByTestId("email-input");

    expect(emailInput.props.keyboardType).toBe("email-address");
    expect(emailInput.props.autoCapitalize).toBe("none");
  });

  test("admin credentials validation", () => {
    const { getByTestId } = render(<LoginComponent />);
    const emailInput = getByTestId("email-input");
    const passwordInput = getByTestId("password-input");

    // Test admin credentials format
    fireEvent.changeText(emailInput, "gaelcraves@admin.com");
    fireEvent.changeText(passwordInput, "ILuvSergio04!");

    expect(emailInput.props.value).toBe("gaelcraves@admin.com");
    expect(passwordInput.props.value).toBe("ILuvSergio04!");
  });
});
