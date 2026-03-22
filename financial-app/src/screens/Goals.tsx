import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGoals, Goal } from "../contexts/GoalsContext";
import { RootStackParamList } from "../@types/navigation";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const getPercent = (current: number, target: number) =>
  Math.min(Math.round((current / target) * 100), 100);

// ─── Goal Card ────────────────────────────────────────────────────────────────
function GoalCard({ goal, onAdd }: { goal: Goal; onAdd: (goal: Goal) => void }) {
  const percent = getPercent(goal.current, goal.target);
  const remaining = goal.target - goal.current;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrapper, { backgroundColor: goal.color + "22" }]}>
          <Ionicons name={goal.icon as any} size={20} color={goal.color} />
        </View>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.cardTitle}>{goal.title}</Text>
          <Text style={styles.cardValues}>
            {formatCurrency(goal.current)}{" "}
            <Text style={styles.cardTarget}>de {formatCurrency(goal.target)}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${percent}%` as any, backgroundColor: goal.color },
          ]}
        />
      </View>

      <View style={styles.progressLabels}>
        <Text style={[styles.percentText, { color: goal.color }]}>
          {percent}% completo
        </Text>
        {remaining > 0 ? (
          <Text style={styles.remainingText}>Faltam {formatCurrency(remaining)}</Text>
        ) : (
          <Text style={[styles.remainingText, { color: "#4ADE80" }]}>🎉 Meta atingida!</Text>
        )}
      </View>

      {remaining > 0 && (
        <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(goal)}>
          <Text style={styles.addBtnText}>Adicionar valor</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function Goals() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { goals, addValueToGoal } = useGoals();

  const [addModal, setAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [addValue, setAddValue] = useState("");

  function handleOpenAdd(goal: Goal) {
    setSelectedGoal(goal);
    setAddValue("");
    setAddModal(true);
  }

  function handleConfirmAdd() {
    if (!selectedGoal) return;
    const amount = parseFloat(addValue.replace(",", "."));
    if (isNaN(amount) || amount <= 0) return;
    addValueToGoal(selectedGoal.id, amount);
    setAddModal(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>Metas</Text>
            <View style={styles.taglineRow}>
              <Ionicons name="sunny-outline" size={13} color="#F59E0B" />
              <Text style={styles.tagline}>Cada passo iluminado conta</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <GoalCard goal={item} onAdd={handleOpenAdd} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("AddGoal")}
          >
            <Ionicons name="add" size={18} color="#2563EB" />
            <Text style={styles.createBtnText}>Criar nova meta</Text>
          </TouchableOpacity>
        }
      />

      {/* ── Add Value Modal ── */}
      <Modal visible={addModal} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setAddModal(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Adicionar valor</Text>
                {selectedGoal && (
                  <Text style={styles.modalSubtitle}>{selectedGoal.title}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setAddModal(false)}
              >
                <Ionicons name="close" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Progress preview */}
            {selectedGoal && (
              <View style={styles.modalPreview}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${getPercent(selectedGoal.current, selectedGoal.target)}%` as any,
                        backgroundColor: selectedGoal.color,
                      },
                    ]}
                  />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={[styles.percentText, { color: selectedGoal.color }]}>
                    {getPercent(selectedGoal.current, selectedGoal.target)}% completo
                  </Text>
                  <Text style={styles.remainingText}>
                    Faltam {formatCurrency(selectedGoal.target - selectedGoal.current)}
                  </Text>
                </View>
              </View>
            )}

            <TextInput
              style={styles.modalInput}
              placeholder="R$ 0,00"
              placeholderTextColor="#475569"
              keyboardType="numeric"
              value={addValue}
              onChangeText={setAddValue}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setAddModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirmBtn,
                  (!addValue || parseFloat(addValue) <= 0) && styles.modalConfirmBtnDisabled,
                ]}
                onPress={handleConfirmAdd}
                disabled={!addValue || parseFloat(addValue) <= 0}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F1F5F9",
    marginBottom: 6,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 13,
    color: "#64748B",
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 2,
  },
  cardValues: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F1F5F9",
  },
  cardTarget: {
    fontSize: 13,
    fontWeight: "400",
    color: "#64748B",
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#334155",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "700",
  },
  remainingText: {
    fontSize: 12,
    color: "#64748B",
  },
  addBtn: {
    backgroundColor: "#0F172A",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  addBtnText: {
    color: "#E2E8F0",
    fontWeight: "600",
    fontSize: 14,
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    marginTop: 4,
  },
  createBtnText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalSheet: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderColor: "#334155",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#334155",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F1F5F9",
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  modalPreview: {
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: "#0F172A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: "#F1F5F9",
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#0F172A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalCancelText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 14,
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    alignItems: "center",
  },
  modalConfirmBtnDisabled: {
    opacity: 0.45,
  },
  modalConfirmText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});