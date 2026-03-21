import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TransactionItem } from "../components/TransactionItem";
import { Transaction } from "../@types/transaction";
import { exportToPDF } from "../services/exportService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../@types/navigation";
import { useTransactions } from "../contexts/TransactionContext";

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Dados de exemplo (Mock)
   const { transactions } = useTransactions();

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0);

    return {
      total: income - expense,
      income,
      expense,
    };
  }, [transactions]);

  const handleExport = () => {
    exportToPDF(transactions, "Março");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Helena</Text>
          <Text style={styles.subtitle}>Lighthouse Finance</Text>
        </View>
        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Ionicons name="download-outline" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo Total</Text>
        <Text style={styles.balanceValue}>
          {new Intl.NumberFormat("pt-PT", {
            style: "currency",
            currency: "EUR",
          }).format(totals.total)}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={20} color="#BBF7D0" />
            <Text style={styles.statValue}>€{totals.income.toFixed(2)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={20} color="#FECACA" />
            <Text style={styles.statValue}>€{totals.expense.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Atividade Recente</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Transactions")}>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  exportButton: {
    padding: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },
  balanceCard: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: "#2563EB",
    borderRadius: 24,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    color: "#BFDBFE",
    fontSize: 14,
  },
  balanceValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  statValue: {
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "600",
  },
  listSection: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 24,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  seeAll: {
    color: "#2563EB",
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
