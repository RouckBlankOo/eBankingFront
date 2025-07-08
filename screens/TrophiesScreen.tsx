import { ThemedText } from "@/components/ThemedText";
import { OnboardingBackground } from "@/components/UniversalBackground";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SuccessIcon } from "../components/LottieIcon";

interface Trophy {
  id: string;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  earned: boolean;
  date?: string;
}

const TrophiesScreen = () => {
  const insets = useSafeAreaInsets();

  // Sample trophies data
  const trophies: Trophy[] = [
    {
      id: "1",
      title: "First Deposit",
      description: "Make your first deposit",
      iconName: "trophy-outline",
      earned: false,
    },
    {
      id: "2",
      title: "Account Created",
      description: "Successfully created your account",
      iconName: "star-outline",
      earned: true,
      date: "June 30, 2025",
    },
    {
      id: "3",
      title: "First Transaction",
      description: "Complete your first transaction",
      iconName: "medal-outline",
      earned: false,
    },
    {
      id: "4",
      title: "Profile Complete",
      description: "Complete your profile setup",
      iconName: "ribbon-outline",
      earned: false,
    },
  ];

  const renderTrophy = (trophy: Trophy) => (
    <View key={trophy.id} style={styles.trophyCard}>
      <View style={styles.trophyLeft}>
        <View
          style={[styles.trophyIcon, trophy.earned && styles.trophyIconEarned]}
        >
          <Ionicons
            name={trophy.iconName}
            size={24}
            color={trophy.earned ? "#FFD700" : "rgba(255, 255, 255, 0.4)"}
          />
        </View>
        <View style={styles.trophyInfo}>
          <ThemedText
            style={[
              styles.trophyTitle,
              trophy.earned && styles.trophyTitleEarned,
            ]}
          >
            {trophy.title}
          </ThemedText>
          <ThemedText style={styles.trophyDescription}>
            {trophy.description}
          </ThemedText>
          {trophy.earned && trophy.date && (
            <ThemedText style={styles.trophyDate}>
              Earned on {trophy.date}
            </ThemedText>
          )}
        </View>
      </View>
      {trophy.earned && (
        <View style={styles.earnedBadge}>
          <SuccessIcon size={20} />
        </View>
      )}
    </View>
  );

  return (
    <OnboardingBackground style={styles.container}>
      <ScrollView
        style={[styles.scrollContainer, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Trophies</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Track your achievements and milestones
          </ThemedText>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {trophies.filter((t) => t.earned).length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Earned</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{trophies.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Total</ThemedText>
          </View>
        </View>

        {/* Trophies List */}
        <View style={styles.trophiesContainer}>
          <ThemedText style={styles.sectionTitle}>All Trophies</ThemedText>
          {trophies.map(renderTrophy)}
        </View>
      </ScrollView>
    </OnboardingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
  },
  trophiesContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  trophyCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  trophyLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  trophyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  trophyIconEarned: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
  },
  trophyInfo: {
    flex: 1,
  },
  trophyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  trophyTitleEarned: {
    color: "#FFFFFF",
  },
  trophyDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 2,
  },
  trophyDate: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  earnedBadge: {
    marginLeft: 12,
  },
});

export default TrophiesScreen;
