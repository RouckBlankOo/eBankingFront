import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { OnboardingBackground } from "../components/UniversalBackground";
import Text from "../components/Text";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type CountryType = 'Tunisia' | 'USA' | 'UK' | 'UAE';

type AccountCreationSuccessProps = {
  route: {
    params?: {
      country?: CountryType;
      email?: string;
    };
  };
};

const COUNTRIES: Record<CountryType, any> = {
  Tunisia: require("../assets/images/flags/tunisia.png"),
  USA: require("../assets/images/flags/usa.png"),
  UK: require("../assets/images/flags/uk.png"),
  UAE: require("../assets/images/flags/uae.png"),
  // Add more countries as needed
};

const AccountCreationSuccessScreen: React.FC<AccountCreationSuccessProps> = ({
  route,
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { country = "Tunisia" } = route.params || {};

  const handleBack = () => {
    navigation.goBack();
  };

  const handleContinue = () => {
    // Navigate to the main app
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

  // Default to Tunisia if country not found
  const flagImage = COUNTRIES[country] || COUNTRIES.Tunisia;

  return (
    <OnboardingBackground style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {/* Flag Image */}
        <View style={styles.flagContainer}>
          <Image source={flagImage} style={styles.flagImage} />
        </View>

        {/* Congratulations Text */}
        <Text style={styles.title}>CONGRATULATIONS!</Text>
        <Text style={styles.subtitle}>YOU&apos;RE ALMOST READY</Text>
        <Text style={styles.subtitle}>TO JOIN THE APP</Text>

        {/* Description Text */}
        <Text style={styles.description}>
          Thanks for your interest in joining Revolut in {country}! Leave your
          email below and we&apos;ll let you know as soon as your account is ready
          for you to sign up
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
        >
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8", "#1E40AF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </OnboardingBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  flagContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF3B30", // Red background for Tunisia flag
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    overflow: "hidden",
  },
  flagImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.8,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 40,
    lineHeight: 24,
  },
  continueButton: {
    width: width - 60,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default AccountCreationSuccessScreen;
