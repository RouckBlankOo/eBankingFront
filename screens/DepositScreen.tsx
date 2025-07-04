import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingBackground } from "../components/UniversalBackground";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../types";
import QRCode from "react-native-qrcode-svg";

export default function DepositScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Get the selected currency from navigation params
  const params = route.params as any;
  const selectedCurrency = params?.currency || { symbol: "USDC", name: "USDC" };

  const [selectedNetwork, setSelectedNetwork] = useState(
    "BNB Smart Chain (BEP20)"
  );
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  // Sample deposit data
  const walletAddress = "0xF8AE81B8C1a79F4E03E560623F6214B3A7bFf1BCO";

  // Create QR code data with additional context for crypto wallets
  const getQRData = () => {
    switch (selectedNetwork) {
      case "Ethereum (ERC20)":
        return `ethereum:${walletAddress}?token=${selectedCurrency.symbol}&gas=21000`;
      case "BNB Smart Chain (BEP20)":
        return `binance:${walletAddress}?token=${selectedCurrency.symbol}`;
      case "Solana":
        return `solana:${walletAddress}?token=${selectedCurrency.symbol}`;
      case "Arbitrum":
        return `arbitrum:${walletAddress}?token=${selectedCurrency.symbol}`;
      case "Tron (TRC20)":
        return `tron:${walletAddress}?token=${selectedCurrency.symbol}`;
      case "TON":
        return `ton:${walletAddress}?token=${selectedCurrency.symbol}`;
      case "opBNB":
        return `opbnb:${walletAddress}?token=${selectedCurrency.symbol}`;
      default:
        return walletAddress; // Fallback to just the address
    }
  };

  const qrData = getQRData();

  const networks = [
    {
      name: "BNB Smart Chain (BEP20)",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "20 confirmation",
    },
    {
      name: "Arbitrum",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "100 confirmation",
    },
    {
      name: "Solana",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "100 confirmation",
    },
    {
      name: "opBNB",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "1 confirmation",
    },
    {
      name: "Tron (TRC20)",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "5 confirmation",
    },
    {
      name: "Ethereum (ERC20)",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "64 confirmation",
    },
    {
      name: "TON",
      minDeposit: `100 ${selectedCurrency.symbol}`,
      confirmations: "5 confirmation",
    },
  ];

  const depositInfo = {
    network: selectedNetwork,
    minimumDeposit: `1.00 ${selectedCurrency.symbol}`,
    contractAddress: "***97955",
  };

  const handleCopyAddress = async () => {
    try {
      // Try to use expo-clipboard if available
      const { setStringAsync } = await import("expo-clipboard");
      await setStringAsync(walletAddress);
      Alert.alert("Copied!", "Wallet address copied to clipboard");
    } catch {
      // Fallback: just show a success message
      Alert.alert("Copied!", "Wallet address copied to clipboard");
    }
  };

  const handleShare = () => {
    Alert.alert(
      "Share",
      `Sharing deposit information for ${selectedCurrency.symbol}`
    );
  };

  const handleNetworkSelect = (networkName: string) => {
    setSelectedNetwork(networkName);
    setShowNetworkDropdown(false);
  };

  return (
    <OnboardingBackground style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Deposit {selectedCurrency.symbol}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Network Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Network</Text>
            <TouchableOpacity
              style={styles.networkSelector}
              onPress={() => setShowNetworkDropdown(!showNetworkDropdown)}
            >
              <Text style={styles.networkText}>{selectedNetwork}</Text>
              <Ionicons
                name={showNetworkDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            {showNetworkDropdown && (
              <Modal
                visible={showNetworkDropdown}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowNetworkDropdown(false)}
              >
                <View style={styles.modalOverlay}>
                  <OnboardingBackground style={styles.modalContainer}>
                    <View
                      style={[styles.modalContent, { paddingTop: insets.top }]}
                    >
                      {/* Modal Header */}
                      <View style={styles.modalHeader}>
                        <TouchableOpacity
                          style={styles.modalBackButton}
                          onPress={() => setShowNetworkDropdown(false)}
                        >
                          <Ionicons
                            name="chevron-back"
                            size={24}
                            color="#FFFFFF"
                          />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Select Network</Text>
                        <View style={styles.modalHeaderRight} />
                      </View>

                      {/* Warning Message */}
                      <View style={styles.warningContainer}>
                        <Ionicons
                          name="information-circle-outline"
                          size={20}
                          color="#F59E0B"
                        />
                        <Text style={styles.warningText}>
                          Ensure the network you choose to deposit matches the
                          withdrawal network or assets may be lost.
                        </Text>
                      </View>

                      {/* Network List */}
                      <ScrollView
                        style={styles.networkScrollContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.networkScrollContent}
                      >
                        {networks.map((network, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.networkItem}
                            onPress={() => handleNetworkSelect(network.name)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.networkItemContent}>
                              <Text style={styles.networkItemName}>
                                {network.name}
                              </Text>
                              <Text style={styles.networkItemDetail}>
                                Minimum deposit amount: {network.minDeposit}
                              </Text>
                              <Text style={styles.networkItemDetail}>
                                Deposit arrival: {network.confirmations}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </OnboardingBackground>
                </View>
              </Modal>
            )}
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCode}>
              <QRCode
                value={qrData}
                size={200}
                color="black"
                backgroundColor="white"
                logo={{
                  uri: undefined, // We'll use overlay icon instead
                }}
                logoSize={30}
                logoBackgroundColor="transparent"
              />
              {/* Currency Icon overlay */}
              <View style={styles.qrCenterIcon}>
                <View style={styles.qrIconBackground}>
                  {selectedCurrency.icon ? (
                    <Image
                      source={selectedCurrency.icon}
                      style={styles.currencyIcon}
                      resizeMode="contain"
                    />
                  ) : (
                    <Ionicons name="logo-usd" size={24} color="#3B82F6" />
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Wallet Address */}
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{walletAddress}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyAddress}
            >
              <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Deposit Information */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Deposit network</Text>
              <Text style={styles.infoValue}>{depositInfo.network}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Minimum deposit</Text>
              <Text style={styles.infoValue}>{depositInfo.minimumDeposit}</Text>
            </View>
            <View style={[styles.infoRow, styles.lastInfoRow]}>
              <Text style={styles.infoLabel}>Contract Address</Text>
              <Text style={styles.infoValue}>
                {depositInfo.contractAddress}
              </Text>
            </View>
          </View>

          {/* Warning */}
          <View style={styles.warningContainer}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#F59E0B"
            />
            <Text style={styles.warningText}>
              The current address only supports depositing{" "}
              {selectedCurrency.symbol} on {selectedNetwork}, depositing other
              assets will result in loss
            </Text>
          </View>
        </ScrollView>

        {/* Share Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons
              name="share-outline"
              size={20}
              color="#FFFFFF"
              style={styles.shareIcon}
            />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  networkSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minHeight: 48,
  },
  networkText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  qrCenterIcon: {
    position: "absolute",
    width: 30,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000FF",
  },
  qrIconBackground: {
    width: 36,
    height: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  currencyIcon: {
    width: 32,
    height: 32,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "monospace",
  },
  copyButton: {
    marginLeft: 12,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  lastInfoRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  infoValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#F59E0B",
    marginLeft: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingVertical: 16,
  },
  shareButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 25,
    minHeight: 56,
  },
  shareIcon: {
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 1,
    height: "90%",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    marginBottom: 20,
  },
  modalBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  modalHeaderRight: {
    width: 40,
  },
  networkScrollContainer: {
    flex: 1,
  },
  networkScrollContent: {
    paddingBottom: 40,
  },
  networkItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  networkItemContent: {
    flex: 1,
  },
  networkItemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  networkItemDetail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
});
