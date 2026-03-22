import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTransactions } from "../contexts/TransactionContext";
import { RootStackParamList } from "../@types/navigation";

type TransactionType = "expense" | "income";
type AddTransactionRouteProp = RouteProp<RootStackParamList, "AddTransaction">;

type Category = {
  id: string;
  label: string;
  icon: string;
};

const EXPENSE_CATEGORIES: Category[] = [
  { id: "Mercado", label: "Mercado", icon: "cart-outline" },
  { id: "Transporte", label: "Transporte", icon: "car-outline" },
  { id: "Moradia", label: "Moradia", icon: "home-outline" },
  { id: "Alimentação", label: "Alimentação", icon: "fast-food-outline" },
  { id: "Lazer", label: "Lazer", icon: "game-controller-outline" },
  { id: "Tecnologia", label: "Tecnologia", icon: "laptop-outline" },
  { id: "Saúde", label: "Saúde", icon: "medkit-outline" },
  { id: "Outros", label: "Outros", icon: "ellipsis-horizontal-outline" },
];

const INCOME_CATEGORIES: Category[] = [
  { id: "Salário", label: "Salário", icon: "briefcase-outline" },
  { id: "Freelance", label: "Freelance", icon: "code-slash-outline" },
  { id: "Investimento", label: "Investimento", icon: "trending-up-outline" },
  { id: "Bônus", label: "Bônus", icon: "gift-outline" },
  { id: "Outros", label: "Outros", icon: "ellipsis-horizontal-outline" },
];

export default function AddTransaction() {
  const navigation = useNavigation();
  const route = useRoute<AddTransactionRouteProp>();
  const { addTransaction } = useTransactions();

  const [type, setType] = useState<TransactionType>(route.params.type);
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [account, setAccount] = useState("");

  const categories = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const isValid =
    value.trim().length > 0 &&
    parseFloat(value.replace(",", ".")) > 0 &&
    category.length > 0;

  function handleTypeChange(newType: TransactionType) {
    setType(newType);
    setCategory("");
  }

  function handleValueChange(text: string) {
    const cleaned = text.replace(/[^0-9,.]/g, "");
    setValue(cleaned);
  }

  function handleSave() {
    if (!isValid) return;

    const amount = parseFloat(value.replace(",", "."));

    addTransaction({
      title: category,
      value: amount,
      type,
      date: new Date(),
      description,
    });

    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#E2E8F0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nova transação</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "expense" && styles.typeBtnExpenseActive,
              ]}
              onPress={() => handleTypeChange("expense")}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  type === "expense" && styles.typeBtnTextActive,
                ]}
              >
                Despesa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeBtn,
                type === "income" && styles.typeBtnIncomeActive,
              ]}
              onPress={() => handleTypeChange("income")}
            >
              <Text
                style={[
                  styles.typeBtnText,
                  type === "income" && styles.typeBtnTextActive,
                ]}
              >
                Receita
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Valor <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.valueInputWrapper}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.valueInput}
                placeholder="0,00"
                placeholderTextColor="#475569"
                keyboardType="numeric"
                value={value}
                onChangeText={handleValueChange}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Categoria <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={category === cat.id ? "#FFFFFF" : "#94A3B8"}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat.id && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Data</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#475569"
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Adicione uma nota (opcional)"
              placeholderTextColor="#475569"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Conta (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Conta corrente"
              placeholderTextColor="#475569"
              value={account}
              onChangeText={setAccount}
            />
            <Text style={styles.fieldHint}>
              Deixe em branco para usar a conta padrão
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!isValid}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>Salvar transação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F1F5F9",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },

  typeToggle: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: "center",
  },
  typeBtnExpenseActive: {
    backgroundColor: "#EF4444",
  },
  typeBtnIncomeActive: {
    backgroundColor: "#10B981",
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  typeBtnTextActive: {
    color: "#FFFFFF",
  },

  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  fieldHint: {
    fontSize: 11,
    color: "#475569",
    marginTop: 6,
  },

  valueInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#F1F5F9",
    paddingVertical: 14,
  },

  input: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#F1F5F9",
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 13,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#94A3B8",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
  },
});