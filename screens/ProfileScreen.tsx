import { ThemedText } from "@/components/ThemedComponents";
import { BankingBackground } from "@/components/UniversalBackground";
import { useTheme } from "@/hooks/useTheme";
import { useUser } from "@/context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { CONSTANTS } from "../constants/index";

const ProfileScreen = () => {
  interface BackendUser {
    _id: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  }

  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { user, logout } = useUser();
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear stored JWT token
            await AsyncStorage.removeItem("jwtToken");

            // Clear user context
            logout();

            // Navigate back to login
            navigation.navigate("Login" as never);
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout properly");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (!token) {
          Alert.alert("Error", "Please log in again");
          return;
        }

        const response = await fetch(
          `${CONSTANTS.API_URL_DEV || CONSTANTS.API_URL_PROD}/user/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Profile Response:", data);

        if (data.success) {
          setBackendUser(data.user);
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

  // Show context user info if available, otherwise show message
  const displayUser = user || backendUser;

  if (!displayUser) {
    return (
      <BankingBackground style={styles.container}>
        <ThemedText variant="secondary">Unable to load profile</ThemedText>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </BankingBackground>
    );
  }

  return (
    <BankingBackground style={styles.container}>
      <ThemedText variant="title" style={styles.title}>
        Profile
      </ThemedText>

      {/* Show user information */}
      {user?.fullName && (
        <ThemedText variant="secondary" style={styles.info}>
          Name: {user.fullName}
        </ThemedText>
      )}

      {backendUser?._id && (
        <ThemedText variant="secondary" style={styles.info}>
          ID: {backendUser._id}
        </ThemedText>
      )}

      {(user?.email || backendUser?.email) && (
        <ThemedText variant="secondary" style={styles.info}>
          Email: {user?.email || backendUser?.email}
        </ThemedText>
      )}

      {(user?.phone || backendUser?.phoneNumber) && (
        <ThemedText variant="secondary" style={styles.info}>
          Phone: {user?.phone || backendUser?.phoneNumber}
        </ThemedText>
      )}

      {backendUser && (
        <>
          <ThemedText variant="secondary" style={styles.info}>
            Email Verified: {backendUser.emailVerified ? "Yes" : "No"}
          </ThemedText>
          <ThemedText variant="secondary" style={styles.info}>
            Phone Verified: {backendUser.phoneVerified ? "Yes" : "No"}
          </ThemedText>
        </>
      )}

      {/* Logout Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>Logout</ThemedText>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    marginTop: 30,
    width: "100%",
  },
  logoutButton: {
    backgroundColor: "#FF4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
