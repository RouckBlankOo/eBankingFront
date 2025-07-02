import { ThemedText } from "@/components/ThemedComponents";
import { BankingBackground } from "@/components/UniversalBackground";
import { useTheme } from "@/hooks/useTheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { CONSTANTS } from "../constants/index"; // Adjust the import path as necessary

const ProfileScreen = () => {
  interface User {
    _id: string;
    email?: string;
    phoneNumber?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          Alert.alert("Error", "Please log in again");
          return;
        }

        const response = await fetch(`${CONSTANTS.API_URL_PROD}/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Profile Response:", data);

        if (data.success) {
          setUser(data.user);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <BankingBackground style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </BankingBackground>
    );
  }

  if (!user) {
    return (
      <BankingBackground style={styles.container}>
        <ThemedText variant="secondary">Unable to load profile</ThemedText>
      </BankingBackground>
    );
  }

  return (
    <BankingBackground style={styles.container}>
      <ThemedText variant="title" style={styles.title}>
        Profile
      </ThemedText>
      <ThemedText variant="secondary" style={styles.info}>
        ID: {user._id}
      </ThemedText>
      {user.email && (
        <ThemedText variant="secondary" style={styles.info}>
          Email: {user.email}
        </ThemedText>
      )}
      {user.phoneNumber && (
        <ThemedText variant="secondary" style={styles.info}>
          Phone: {user.phoneNumber}
        </ThemedText>
      )}
      <ThemedText variant="secondary" style={styles.info}>
        Email Verified: {user.emailVerified ? "Yes" : "No"}
      </ThemedText>
      <ThemedText variant="secondary" style={styles.info}>
        Phone Verified: {user.phoneVerified ? "Yes" : "No"}
      </ThemedText>
    </BankingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;
