import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { useUser } from "@/context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
  Dimensions,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../types";

const { width } = Dimensions.get("window");

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const SetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "SetPassword">>();
  const { setUser } = useUser();
  const insets = useSafeAreaInsets();

  // Generate random user ID like "User-21gh6"
  const generateRandomUserId = (): string => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "User-";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Password validation requirements
  const getRequirements = (pwd: string): PasswordRequirement[] => [
    {
      text: "8 to 32 characters",
      met: pwd.length >= 8 && pwd.length <= 32,
    },
    {
      text: "At least one uppercase letter",
      met: /[A-Z]/.test(pwd),
    },
    {
      text: "At least one lowercase letter",
      met: /[a-z]/.test(pwd),
    },
    {
      text: "At least one number",
      met: /\d/.test(pwd),
    },
    {
      text: "At least one special character",
      met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    },
  ];

  const requirements = getRequirements(password);

  const handleSetPassword = async () => {
    if (password.length === 0) {
      setSnackbarMessage("Please enter a password");
      setSnackbarVisible(true);
      return;
    }

    if (confirmPassword.length === 0) {
      setSnackbarMessage("Please confirm your password");
      setSnackbarVisible(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarVisible(true);
      return;
    }

    const allRequirementsMet = requirements.every((req) => req.met);
    if (!allRequirementsMet) {
      setSnackbarMessage("Please meet all password requirements");
      setSnackbarVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      // Here you would make an API call to set the password
      console.log("Setting password for user:", password);

      // Generate random user ID
      const randomUserId = generateRandomUserId();

      // Save user data to context
      const contactInfo = route.params?.contactInfo || "";
      const signupMode = route.params?.signupMode || "email";

      setUser({
        fullName: randomUserId,
        email: signupMode === "email" ? contactInfo : "",
        phone: signupMode === "phone" ? contactInfo : "",
        isAuthenticated: true,
      });

      // Navigate to main app immediately (no delay)
      navigation.navigate("MainApp");
    } catch (error: any) {
      console.error("Password setup failed:", error);
      setSnackbarMessage("Failed to create account. Please try again.");
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <OnboardingBackground style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 10 }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Blurred Container */}
        <BlurView intensity={0.2} style={styles.blurContainer}>
          {/* Title */}
          <ThemedText style={styles.title}>Set your password</ThemedText>

          {/* Description */}
          <ThemedText style={styles.description}>
            Create a strong password to secure your account
          </ThemedText>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="rgba(255, 255, 255, 0.6)"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="rgba(255, 255, 255, 0.6)"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="rgba(255, 255, 255, 0.6)"
              />
            </TouchableOpacity>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            {requirements.map((requirement, index) => (
              <View key={index} style={styles.requirementRow}>
                <Ionicons
                  name={
                    requirement.met ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={16}
                  color={
                    requirement.met ? "#00C851" : "rgba(255, 255, 255, 0.4)"
                  }
                />
                <ThemedText
                  style={[
                    styles.requirementText,
                    requirement.met && styles.requirementTextMet,
                  ]}
                >
                  {requirement.text}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (password.length === 0 ||
                confirmPassword.length === 0 ||
                !requirements.every((req) => req.met) ||
                password !== confirmPassword ||
                isLoading) &&
                styles.continueButtonDisabled,
            ]}
            onPress={handleSetPassword}
            disabled={
              password.length === 0 ||
              confirmPassword.length === 0 ||
              !requirements.every((req) => req.met) ||
              password !== confirmPassword ||
              isLoading
            }
          >
            <ThemedText style={styles.continueButtonText}>
              {isLoading ? "Setting Password..." : "Continue"}
            </ThemedText>
          </TouchableOpacity>
        </BlurView>

        {/* Snackbar */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </OnboardingBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    width: width * 0.9,
    maxWidth: 400,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 32,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 0,
    top: 18,
    zIndex: 1,
  },
  input: {
    width: "100%",
    height: 56,
    paddingLeft: 32,
    paddingRight: 48,
    fontSize: 16,
    color: "#FFFFFF",
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  eyeIcon: {
    position: "absolute",
    right: 0,
    top: 18,
    padding: 4,
  },
  requirementsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requirementText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 12,
    flex: 1,
  },
  requirementTextMet: {
    color: "#00C851",
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  snackbar: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});

export default SetPasswordScreen;
