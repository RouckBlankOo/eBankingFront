import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "../components/Text";
import { CONSTANTS } from "../constants"; // Import your constants file

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(
        `${
          CONSTANTS.API_URL_DEV || CONSTANTS.API_URL_PROD
        }/auth/forgot-password`,
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

      if (response.ok && data.success) {
        Alert.alert("Success", data.message, [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Failed to send reset request");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      Alert.alert(
        "Error",
        "Failed to send reset request. Please check your internet connection and try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address below and we&#39;ll send you instructions to
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#6a5acd",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ForgotPasswordScreen;
