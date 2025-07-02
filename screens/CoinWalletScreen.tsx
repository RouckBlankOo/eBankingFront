import { ThemedText } from "@/components/ThemedComponents";
import { BankingBackground } from "@/components/UniversalBackground";
import React from "react";
import { StyleSheet } from "react-native";

const CoinWalletScreen = () => {
  return (
    <BankingBackground style={styles.container}>
      <ThemedText variant="title" style={styles.title}>
        CoinWallet
      </ThemedText>
      <ThemedText variant="secondary" style={styles.subtitle}>
        Manage your wallet here.
      </ThemedText>
    </BankingBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default CoinWalletScreen;
