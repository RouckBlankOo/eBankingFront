import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { OnboardingBackground } from "../../components/UniversalBackground";
import { UserHeader } from "../../components/UserHeader";
import Text from "../../components/Text";
import MoreOptionsModal, {
  MoreOption,
} from "../../components/MoreOptionsModal";
import { useAlert } from "../../context/AlertContext";
import { RootStackParamList } from "../../types";
import { useUser, Card } from "../../context/UserContext";

const { width: screenWidth } = Dimensions.get("window");

interface GetCardOption {
  id: string;
  type: "get-card";
}

type CardOrGetCard = Card | GetCardOption;

interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: string;
  date: string;
  time: string;
}

function CardsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { cards, updateCard, deleteCard } = useUser();

  // Custom alert hook
  const { showSuccess, showError, showInfo, showDestructiveConfirm } =
    useAlert();

  // State for managing cards and UI
  const [selectedCardId, setSelectedCardId] = useState<string>(
    cards.length > 0 ? cards[0].id : "1"
  ); // Default to first card

  // State for limit modal
  const [limitModalVisible, setLimitModalVisible] = useState(false);
  const [newLimit, setNewLimit] = useState("");

  // State for more actions modal
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [changeNameModalVisible, setChangeNameModalVisible] = useState(false);
  const [newCardName, setNewCardName] = useState("");

  // Get selected card - memoized for performance
  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [cards, selectedCardId]
  );

  // Combine cards with get card option - memoized for performance
  const cardsWithGetCardOption: CardOrGetCard[] = useMemo(
    () => [...cards, { id: "get-card", type: "get-card" } as GetCardOption],
    [cards]
  );

  // Card action functions
  const handleFreezeCard = useCallback(() => {
    if (selectedCard) {
      updateCard(selectedCardId, { isFrozen: !selectedCard.isFrozen });
      const action = selectedCard.isFrozen ? "unfrozen" : "frozen";
      showSuccess("Card Status", `Card has been ${action}`, 3000);
    }
  }, [selectedCard, selectedCardId, updateCard, showSuccess]);

  const handleToggleSensitiveInfo = useCallback(() => {
    if (selectedCard) {
      updateCard(selectedCardId, { isInfoHidden: !selectedCard.isInfoHidden });
    }
  }, [selectedCard, selectedCardId, updateCard]);

  const handleOpenLimitModal = () => {
    setNewLimit(selectedCard?.limit?.toString() || "");
    setLimitModalVisible(true);
  };

  const handleSetLimit = useCallback(() => {
    const limitValue = parseFloat(newLimit);
    if (isNaN(limitValue) || limitValue <= 0) {
      showError("Invalid Limit", "Please enter a valid positive number");
      return;
    }

    updateCard(selectedCardId, { limit: limitValue });

    setLimitModalVisible(false);
    showSuccess(
      "Limit Updated",
      `Card limit set to $${limitValue.toFixed(2)}`,
      3000
    );
  }, [newLimit, selectedCardId, updateCard, showError, showSuccess]);

  // More button actions
  const handleMoreButton = () => {
    setMoreModalVisible(true);
  };

  const handleChangeName = useCallback(() => {
    setNewCardName(selectedCard?.name || selectedCard?.type || "");
    setChangeNameModalVisible(true);
  }, [selectedCard]);

  const handleConfirmChangeName = useCallback(() => {
    if (!newCardName.trim()) {
      showError("Invalid Name", "Please enter a valid card name");
      return;
    }

    updateCard(selectedCardId, { name: newCardName.trim() });

    setChangeNameModalVisible(false);
    showSuccess(
      "Name Updated",
      `Card name changed to "${newCardName.trim()}"`,
      3000
    );
  }, [newCardName, selectedCardId, updateCard, showError, showSuccess]);

  const handleEditCardDesign = useCallback(() => {
    showInfo("Edit Design", "Card design editor coming soon!");
  }, [showInfo]);

  const handleDeleteCard = useCallback(() => {
    showDestructiveConfirm(
      "Delete Card",
      "Are you sure you want to delete this card? This action cannot be undone.",
      () => {
        deleteCard(selectedCardId);

        // Select the first remaining card or reset if no cards left
        const remainingCards = cards.filter(
          (card) => card.id !== selectedCardId
        );
        if (remainingCards.length > 0) {
          setSelectedCardId(remainingCards[0].id);
        } else {
          setSelectedCardId("");
        }

        showSuccess("Card Deleted", "Card has been successfully deleted", 3000);
      }
    );
  }, [selectedCardId, cards, deleteCard, showDestructiveConfirm, showSuccess]);

  // Card more options configuration
  const cardMoreOptions: MoreOption[] = [
    {
      id: "change-name",
      title: "Change Name",
      description: "Customize your card display name",
      icon: "create-outline",
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: handleChangeName,
    },
    {
      id: "edit-design",
      title: "Edit Card Design",
      description: "Personalize your card appearance",
      icon: "color-palette-outline",
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: handleEditCardDesign,
    },
    {
      id: "delete-card",
      title: "Delete Card",
      description: "Permanently remove this card",
      icon: "trash-outline",
      gradient: ["rgba(29, 36, 45, 1)", "rgba(29, 36, 45, 0.5)"],
      onPress: handleDeleteCard,
      isDanger: true,
    },
  ];

  // Empty transactions array
  const transactions: Transaction[] = [];

  const renderCard = ({ item, index }: { item: Card; index: number }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.gradient[0], opacity: item.isFrozen ? 0.6 : 1 },
        selectedCardId === item.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedCardId(item.id)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardChip} />
        <Text style={styles.cardType}>{item.name || item.type}</Text>
        {item.isFrozen && (
          <View style={styles.frozenBadge}>
            <Text style={styles.frozenText}>FROZEN</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>
            $ {item.isInfoHidden ? "***.**" : item.balance}
          </Text>
        </View>
        <Text style={styles.cardNumber}>
          {item.isInfoHidden ? "**** **** **** ****" : item.cardNumber}
        </Text>
        <View style={styles.cardBrand}>
          <Text style={styles.cardBrandText}>VISA</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGetCard = () => (
    <TouchableOpacity
      style={styles.getCardContainer}
      onPress={() => navigation.navigate("CardTypes")}
    >
      <View style={styles.getCardContent}>
        <View style={styles.getCardButton}>
          <Text style={styles.getCardText}>+ Get Card</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCardOrGetCard = ({ item }: { item: CardOrGetCard }) => {
    if (item.type === "get-card") {
      return renderGetCard();
    }
    return renderCard({ item: item as Card, index: 0 });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIconContainer}>
          <Ionicons name="card-outline" size={20} color="#3B82F6" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
        <Text style={styles.transactionTime}>
          {item.date} {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <OnboardingBackground style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      {/* Status bar background overlay */}
      <View style={[styles.statusBarBackground, { height: insets.top }]} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: insets.top + 1 }}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <UserHeader
            greetingText="Good Day 👋"
            useProfileImage={true}
            avatarSize={65}
          />
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        {/* My Cards Section */}
        <View style={styles.cardsSection}>
          <View style={styles.cardsSectionHeader}>
            <Text style={styles.sectionTitle}>My Cards</Text>
          </View>
          <FlatList
            data={cardsWithGetCardOption}
            renderItem={renderCardOrGetCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            snapToInterval={screenWidth - 60}
            decelerationRate="fast"
            bounces={false}
            // Performance optimizations
            removeClippedSubviews={true}
            initialNumToRender={3}
            maxToRenderPerBatch={3}
            windowSize={5}
            getItemLayout={(data, index) => ({
              length: screenWidth - 60,
              offset: (screenWidth - 60 + 16) * index,
              index,
            })}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFreezeCard}
          >
            <LinearGradient
              colors={["rgba(196, 208, 224, 1)", "rgba(196, 208, 224, 0.6)"]}
              style={styles.actionIconContainer}
            >
              <Image
                source={require("../assets/Icons/Freeze.png")}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>
              {selectedCard?.isFrozen ? "Unfreeze" : "Freeze"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleToggleSensitiveInfo}
          >
            <LinearGradient
              colors={["rgba(196, 208, 224, 1)", "rgba(196, 208, 224, 0.6)"]}
              style={styles.actionIconContainer}
            >
              <Image
                source={require("../assets/Icons/Info.png")}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>
              {selectedCard?.isInfoHidden ? "Show Details" : "Hide Details"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleOpenLimitModal}
          >
            <LinearGradient
              colors={["rgba(196, 208, 224, 1)", "rgba(196, 208, 224, 0.6)"]}
              style={styles.actionIconContainer}
            >
              <Image
                source={require("../assets/Icons/Limit.png")}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>Limit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleMoreButton}
          >
            <LinearGradient
              colors={["rgba(196, 208, 224, 1)", "rgba(196, 208, 224, 0.6)"]}
              style={styles.actionIconContainer}
            >
              <Image
                source={require("../assets/Icons/More.png")}
                style={styles.actionIcon}
                resizeMode="contain"
              />
            </LinearGradient>
            <Text style={styles.actionButtonText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Latest Transactions</Text>
            <Text style={styles.sectionSubtitle}>All Cards History</Text>
          </View>

          {/* Empty state when no transactions */}
          {transactions.length === 0 ? (
            <View style={styles.emptyTransactionsContainer}>
              <View style={styles.emptyTransactionCard}>
                <Text style={styles.emptyTransactionText}>
                  No transactions yet
                </Text>
                <Text style={styles.emptyTransactionSubtext}>
                  Your recent transactions will appear here
                </Text>
              </View>
            </View>
          ) : (
            <FlatList
              data={transactions}
              renderItem={renderTransaction}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.transactionSeparator} />
              )}
              // Performance optimizations
              removeClippedSubviews={false} // Keep false for scrollEnabled={false}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              windowSize={10}
            />
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Limit Modal */}
      <Modal
        visible={limitModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLimitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Card Limit</Text>
            <Text style={styles.modalSubtitle}>
              Current limit: ${selectedCard?.limit?.toFixed(2) || "0.00"}
            </Text>
            <TextInput
              style={styles.limitInput}
              value={newLimit}
              onChangeText={setNewLimit}
              placeholder="Enter new limit"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLimitModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSetLimit}
              >
                <Text style={styles.confirmButtonText}>Set Limit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* More Actions Modal */}
      <MoreOptionsModal
        visible={moreModalVisible}
        onClose={() => setMoreModalVisible(false)}
        options={cardMoreOptions}
        title="Card Options"
        subtitle="Manage your card settings"
        headerIcon="card"
        headerIconColor="#3B82F6"
      />

      {/* Change Name Modal */}
      <Modal
        visible={changeNameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChangeNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Card Name</Text>
            <Text style={styles.modalSubtitle}>
              Current name: {selectedCard?.name || selectedCard?.type || "Card"}
            </Text>
            <TextInput
              style={styles.limitInput}
              value={newCardName}
              onChangeText={setNewCardName}
              placeholder="Enter new card name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setChangeNameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmChangeName}
              >
                <Text style={styles.confirmButtonText}>Change Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    zIndex: 1000,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardsSection: {
    paddingVertical: 20,
  },
  cardsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  addCardButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    width: screenWidth - 80,
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardChip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cardType: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardContent: {
    alignItems: "flex-start",
  },
  balanceSection: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardNumber: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "monospace",
    marginBottom: 8,
  },
  cardBrand: {
    alignSelf: "flex-end",
  },
  cardBrandText: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 2,
  },
  // Get Card Styles
  getCardContainer: {
    width: screenWidth - 80,
    height: 200,
    borderRadius: 16,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  getCardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  getCardButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 40,
  },
  getCardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },
  actionButtonText: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  transactionHeader: {
    marginBottom: 20,
  },
  emptyTransactionsContainer: {
    paddingVertical: 20,
  },
  emptyTransactionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  emptyTransactionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyTransactionSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3B82F6",
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
    marginBottom: 4,
  },
  transactionTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  transactionSeparator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 8,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#3B82F6",
  },
  frozenBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -14 }],
    backgroundColor: "rgba(217, 217, 217, 0.2)",
    paddingHorizontal: 19,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 10,
  },
  frozenText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 20,
  },
  limitInput: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
  },
  // More Modal styles (matching CardActionsModal)
  moreModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  moreModalBlurView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  moreBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  moreModalContent: {
    backgroundColor: "rgba(29, 36, 45, 0.8)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 34, // Account for safe area
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderBottomWidth: 0,
  },
  moreModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  moreHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  moreActionsContainer: {
    paddingTop: 20,
  },
  moreActionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  moreLastActionItem: {
    borderBottomWidth: 0,
  },
  moreActionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreActionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#C4D0E099",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    shadowColor: "rgba(59, 130, 246, 255)",
    shadowOffset: { width: 0, height: 2 },
  },
  moreActionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
});

// Export with React.memo for performance optimization
export default React.memo(CardsScreen);
