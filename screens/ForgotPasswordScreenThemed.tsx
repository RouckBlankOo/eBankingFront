/**
 * Example: ForgotPasswordScreen refactored to use the new theme system
 * This shows how to use the themed components and hooks
 */

import {
  ThemedButton,
  ThemedInput,
  ThemedText,
  ThemedView,
} from "@/components/ThemedComponents";
import { useTheme } from "@/hooks/useTheme";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert } from "react-native";
import { CONSTANTS } from "../constants";

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

const ForgotPasswordScreenThemed = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${CONSTANTS.API_URL_PROD}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("Forgot Password Response:", data);

      if (data.success) {
        Alert.alert("Success", data.message, [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Alert.alert("Error", "Failed to send reset request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView
      style={{
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: "center",
      }}
    >
      <ThemedText
        variant="title"
        style={{
          textAlign: "center",
          marginBottom: theme.spacing.sm,
        }}
      >
        Forgot Password
      </ThemedText>

      <ThemedText
        variant="secondary"
        style={{
          textAlign: "center",
          marginBottom: theme.spacing.xl,
        }}
      >
        Enter your email address below and we&apos;ll send you instructions to
        reset your password.
      </ThemedText>

      <ThemedInput
        label="Email Address"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: theme.spacing.xl }}
      />

      <ThemedButton
        title="Reset Password"
        onPress={handleResetPassword}
        loading={loading}
        variant="primary"
        size="lg"
      />
    </ThemedView>
  );
};

export default ForgotPasswordScreenThemed;
