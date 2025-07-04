import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Text from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface NumberPadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  onDecimal?: () => void;
  showDecimal?: boolean;
  style?: any;
}

const { width } = Dimensions.get("window");

export default function NumberPad({
  onNumberPress,
  onBackspace,
  onDecimal,
  showDecimal = true,
  style,
}: NumberPadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [showDecimal ? "." : "", "0", "⌫"],
  ];

  const handlePress = (value: string) => {
    if (value === "⌫") {
      onBackspace();
    } else if (value === "." && onDecimal) {
      onDecimal();
    } else if (value !== "") {
      onNumberPress(value);
    }
  };

  return (
    <LinearGradient
      colors={["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {numbers.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            styles.row,
            rowIndex === numbers.length - 1 && { marginBottom: 0 },
          ]}
        >
          {row.map((number, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.button,
                number === "" && styles.emptyButton,
                number === "⌫" && styles.backspaceButton,
              ]}
              onPress={() => handlePress(number)}
              disabled={number === ""}
              activeOpacity={0.7}
            >
              {number === "⌫" ? (
                <Ionicons name="backspace-outline" size={24} color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>{number}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    width: (width - 80) / 3,
    height: 55,
    borderRadius: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyButton: {
    backgroundColor: "transparent",
  },
  backspaceButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: "400",
    color: "#FFFFFF",
  },
});
