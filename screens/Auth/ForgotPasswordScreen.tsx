import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Text from "../components/Text";
import { CONSTANTS } from "../constants";
import { useAlert } from "../context/AlertContext";
import { OnboardingBackground } from "../components/UniversalBackground";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { showError, showConfirm } = useAlert();

  const handleResetPassword = async () => {
    if (!email) {
      showError("Error", "Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Error", "Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(
        `${CONSTANTS.API_URL_PROD}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showConfirm(
          "Success",
          "If an account with this email exists, you will receive password reset instructions.",
          () => navigation.navigate("Login")
        );
      } else {
        showError("Error", data.message || "Failed to send reset request");
      }
    } catch (error) {
      console.error("Error:", error);
      showError(
        "Error",
        "Failed to send reset request. Please check your internet connection and try again."
      );
    }
  };

  return (
    <OnboardingBackground style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we will send you instructions to
        reset your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#6a5acd",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
