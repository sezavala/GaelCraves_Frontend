import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, ScrollView, Text, Alert, TextInput, Modal, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  getAllFoodItems,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  FoodItem,
} from "@/services/menuService";

const BG = "#0B1313";
const PANEL = "#0E1717";
const PEACH = "#E7C4A3";
const TEXT = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.72)";
const BORDER = "rgba(255,255,255,0.08)";

export default function MenuManagementScreen() {
  const router = useRouter();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState<FoodItem>({
    name: "",
    price: 0,
    calories: 0,
    description: "",
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await getAllFoodItems();
      setItems(data);
    } catch (e: any) {
      console.error("Failed to load items", e);
      Alert.alert("Error", e.message || "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingItem && editingItem.foodItemId) {
        await updateFoodItem(editingItem.foodItemId, formData);
        Alert.alert("Success", "Menu item updated successfully");
      } else {
        await createFoodItem(formData);
        Alert.alert("Success", "Menu item created successfully");
      }
      setModalVisible(false);
      setEditingItem(null);
      setFormData({ name: "", price: 0, calories: 0, description: "" });
      loadItems();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save menu item");
    }
  };

  const handleDelete = async (itemId: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this menu item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFoodItem(itemId);
              Alert.alert("Success", "Menu item deleted");
              loadItems();
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to delete item");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setFormData(item);
    setModalVisible(true);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({ name: "", price: 0, calories: 0, description: "" });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={TEXT} />
        </Pressable>
        <Text style={styles.title}>Menu Management</Text>
        <Pressable onPress={openCreateModal} style={styles.addButton}>
          <IconSymbol name="plus" size={24} color={BG} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        {items.map((item) => (
          <View key={item.foodItemId} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                ${item.price.toFixed(2)} • {item.calories} cal
              </Text>
              {item.description && (
                <Text style={styles.itemDescription}>{item.description}</Text>
              )}
            </View>
            <View style={styles.itemActions}>
              <Pressable
                onPress={() => openEditModal(item)}
                style={styles.actionButton}
              >
                <IconSymbol name="pencil" size={20} color={PEACH} />
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item.foodItemId!)}
                style={styles.actionButton}
              >
                <IconSymbol name="trash" size={20} color="#ff6b6b" />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit/Create Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? "Edit Item" : "New Item"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Item Name"
              placeholderTextColor={MUTED}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              style={styles.input}
              placeholder="Price"
              placeholderTextColor={MUTED}
              keyboardType="decimal-pad"
              value={formData.price.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, price: parseFloat(text) || 0 })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Calories"
              placeholderTextColor={MUTED}
              keyboardType="number-pad"
              value={formData.calories.toString()}
              onChangeText={(text) =>
                setFormData({ ...formData, calories: parseInt(text) || 0 })
              }
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor={MUTED}
              multiline
              numberOfLines={3}
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={[styles.modalButton, styles.saveButton]}
              >
                <Text style={[styles.buttonText, { color: BG }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
  },
  addButton: {
    backgroundColor: PEACH,
    padding: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingText: {
    color: MUTED,
    textAlign: "center",
    marginTop: 20,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: PANEL,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: PEACH,
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: MUTED,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: PANEL,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 20,
  },
  input: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 12,
    color: TEXT,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  saveButton: {
    backgroundColor: PEACH,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
  },
});
