import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { OnboardingBackground } from "../components/UniversalBackground";
import { useUser } from "../context/UserContext";

const AddressInformationScreen = () => {
  const navigation = useNavigation();
  const { updateProfileStatus } = useUser();
  const [country, setCountry] = useState("Tunisia");
  const [streetAddress, setStreetAddress] = useState("example");
  const [addressLine2, setAddressLine2] = useState(
    "apartment, suite, etc. (optional)"
  );
  const [city, setCity] = useState("example");
  const [postalCode, setPostalCode] = useState("0000");
  const [stateProvince, setStateProvince] = useState(
    "state or province (optional)"
  );

  const handleContinue = () => {
    // Basic validation
    if (!country || !streetAddress || !city || !postalCode) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Mark address information as complete
    updateProfileStatus("addressInformation", true);

    // Navigate to Identity Verification screen
    navigation.navigate("IdentityVerification" as never);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCountrySelect = () => {
    // Handle country selection dropdown
    Alert.alert("Country Selection", "Country selection feature coming soon");
  };

  return (
    <OnboardingBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionContainer}>
              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Address Information</Text>
                <Text style={styles.subtitle}>Where are you located?</Text>
              </View>

              {/* Main Container */}

              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Country */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Country</Text>
                  <TouchableOpacity
                    style={styles.countryContainer}
                    onPress={handleCountrySelect}
                  >
                    <View style={styles.countryContent}>
                      <View style={styles.countryFlag}>
                        <Text style={styles.flagEmoji}>🇹🇳</Text>
                      </View>
                      <Text style={styles.countryText}>{country}</Text>
                    </View>
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color="rgba(255, 255, 255, 0.6)"
                    />
                  </TouchableOpacity>
                </View>

                {/* Street Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Street Address</Text>
                  <TextInput
                    style={styles.input}
                    value={streetAddress}
                    onChangeText={setStreetAddress}
                    placeholder="Street Address"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                </View>

                {/* Address Line 2 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address Line 2</Text>
                  <TextInput
                    style={styles.input}
                    value={addressLine2}
                    onChangeText={setAddressLine2}
                    placeholder="apartment, suite, etc. (optional)"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                </View>

                {/* City and Postal Code Row */}
                <View style={styles.cityPostalRow}>
                  <View style={[styles.inputGroup, styles.cityInput]}>
                    <Text style={styles.inputLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={city}
                      onChangeText={setCity}
                      placeholder="City"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    />
                  </View>
                  <View style={[styles.inputGroup, styles.postalInput]}>
                    <Text style={styles.inputLabel}>Postal Code</Text>
                    <TextInput
                      style={styles.input}
                      value={postalCode}
                      onChangeText={setPostalCode}
                      placeholder="0000"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* State/Province */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>State/Province</Text>
                  <TextInput
                    style={styles.input}
                    value={stateProvince}
                    onChangeText={setStateProvince}
                    placeholder="state or province (optional)"
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  />
                </View>
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.continueButton}
                onPress={handleContinue}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backdropFilter: "blur(20px)",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
    padding: 16,
    paddingLeft: 0,
    color: "#FFFFFF",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  countryContainer: {
    backgroundColor: "transparent",
    padding: 16,
    paddingLeft: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  countryContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryFlag: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 16,
  },
  countryText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  cityPostalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityInput: {
    flex: 1,
    marginRight: 8,
  },
  postalInput: {
    flex: 0.6,
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddressInformationScreen;
