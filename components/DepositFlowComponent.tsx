import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingBackground } from "./UniversalBackground";
import NumberPad from "./NumberPad";
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamList } from "../types";

interface DepositFlowConfig {
  type: "bank" | "binance";
  defaultAmount: string;
  defaultQuickAmount: string;
  quickAmounts: string[];
  rangeText: string;
  exchangeRate?: number;
  showConversion: boolean;
  conversionUnit: string;
}

interface TopUpButtonProps {
  onPress: () => void;
  iconSource: any;
  text: string;
  backgroundColor: string;
  textColor: string;
  iconTintColor: string;
}

const TopUpButton: React.FC<TopUpButtonProps> = ({
  onPress,
  iconSource,
  text,
  backgroundColor,
  textColor,
  iconTintColor,
}) => (
  <TouchableOpacity
    style={[styles.topUpButton, { backgroundColor }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image
      source={iconSource}
      style={[styles.topUpIcon, { tintColor: iconTintColor }]}
    />
    <Text style={[styles.topUpText, { color: textColor }]}>{text}</Text>
  </TouchableOpacity>
);

interface DepositFlowComponentProps {
  config: DepositFlowConfig;
  topUpButton: TopUpButtonProps;
}

export default function DepositFlowComponent({
  config,
  topUpButton,
}: DepositFlowComponentProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Get the selected currency from navigation params
  const params = route.params as any;
  const selectedCurrency = params?.currency || { symbol: "USDC", name: "USDC" };

  const [amount, setAmount] = useState(config.defaultAmount);
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(
    config.defaultQuickAmount
  );

  // Calculate conversion if needed
  const convertedAmount =
    config.showConversion && config.exchangeRate
      ? (parseFloat(amount) * config.exchangeRate).toFixed(2)
      : parseFloat(amount).toFixed(2);

  const handleNumberPress = (number: string) => {
    if (amount === "0" || amount === config.defaultAmount) {
      setAmount(number);
    } else {
      setAmount(amount + number);
    }
    setSelectedQuickAmount("");
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount("0");
    }
    setSelectedQuickAmount("");
  };

  const handleDecimal = () => {
    if (!amount.includes(".")) {
      setAmount(amount + ".");
    }
  };

  const handleQuickAmountSelect = (quickAmount: string) => {
    if (quickAmount === "Max") {
      const maxAmount = config.type === "bank" ? "3000" : "50000";
      setAmount(maxAmount);
      setSelectedQuickAmount("Max");
    } else {
      const numericAmount = quickAmount.replace(
        ` ${config.conversionUnit}`,
        ""
      );
      setAmount(numericAmount);
      setSelectedQuickAmount(numericAmount);
    }
  };

  return (
    <OnboardingBackground style={styles.container}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Deposit {selectedCurrency.name}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* Currency Display */}
        <View style={styles.currencySection}>
          <View style={styles.currencyRow}>
            <View style={styles.currencyIconContainer}>
              {selectedCurrency.icon ? (
                <Image
                  source={selectedCurrency.icon}
                  style={styles.currencyIcon}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.currencyIconPlaceholder}>
                  <Text style={styles.currencyIconText}>$</Text>
                </View>
              )}
            </View>
            <Text style={styles.currencyName}>
              {selectedCurrency.name} ({selectedCurrency.symbol})
            </Text>
          </View>
        </View>

        {/* Deposit Amount Section */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Deposit Amount</Text>

          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            <Text style={styles.amountValue}>
              {config.showConversion
                ? `${amount} ${config.conversionUnit}`
                : amount}
            </Text>
            <TouchableOpacity style={styles.swapButton}>
              <Ionicons name="swap-vertical" size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Conversion Display */}
          {config.showConversion && (
            <Text style={styles.usdcEquivalent}>
              ≈ {convertedAmount} {selectedCurrency.symbol}
            </Text>
          )}

          {/* Range Display */}
          <Text style={styles.rangeText}>{config.rangeText}</Text>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountContainer}>
            {config.quickAmounts.map((quickAmount, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickAmountButton,
                  (selectedQuickAmount === quickAmount ||
                    (quickAmount !== "Max" &&
                      selectedQuickAmount ===
                        quickAmount.replace(
                          ` ${config.conversionUnit}`,
                          ""
                        ))) &&
                    styles.quickAmountButtonSelected,
                ]}
                onPress={() => handleQuickAmountSelect(quickAmount)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    (selectedQuickAmount === quickAmount ||
                      (quickAmount !== "Max" &&
                        selectedQuickAmount ===
                          quickAmount.replace(
                            ` ${config.conversionUnit}`,
                            ""
                          ))) &&
                      styles.quickAmountTextSelected,
                  ]}
                >
                  {quickAmount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Spacer to push content to bottom */}
        <View style={{ flex: 1 }} />

        {/* Top-Up Now Button */}
        <TopUpButton {...topUpButton} />

        {/* Number Pad */}
        <NumberPad
          onNumberPress={handleNumberPress}
          onBackspace={handleBackspace}
          onDecimal={handleDecimal}
          showDecimal={true}
          style={styles.numberPad}
        />
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
    paddingVertical: 12,
    marginBottom: 16,
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
  currencySection: {
    alignItems: "center",
    marginBottom: 30,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  currencyIcon: {
    width: 40,
    height: 40,
  },
  currencyIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },
  currencyIconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  currencyName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  amountSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  amountDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 16,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  usdcEquivalent: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  rangeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 20,
  },
  quickAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickAmountButtonSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    borderColor: "#3B82F6",
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  quickAmountTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  topUpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 16,
    minHeight: 56,
  },
  topUpIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  topUpText: {
    fontSize: 18,
    fontWeight: "600",
  },
  numberPad: {
    marginBottom: 40,
  },
});
