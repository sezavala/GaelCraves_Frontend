import { render } from "@testing-library/react-native";
import React from "react";
import { Text, View, TextInput, TouchableOpacity } from "react-native";

// Mock Login component for testing
const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View>
      <Text testID="login-title">Login</Text>
      <TextInput
        testID="email-input"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        testID="password-input"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity testID="login-button">
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Simple component test
test("renders basic component", () => {
  const { getByText } = render(
    <View>
      <Text>Hello World</Text>
    </View>
  );
  expect(getByText("Hello World")).toBeTruthy();
});

// Login page test
test("renders login page with email and password inputs", () => {
  const { getByTestId, getByText } = render(<LoginPage />);
  
  expect(getByTestId("login-title")).toBeTruthy();
  expect(getByTestId("email-input")).toBeTruthy();
  expect(getByTestId("password-input")).toBeTruthy();
  expect(getByTestId("login-button")).toBeTruthy();
});
