import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../contexts/TransactionContext";
import { TransactionItem } from "../components/TransactionItem";

type FilterPeriod = "Dia" | "Semana" | "Mês";

function groupByDate(transactions: any[]) {
  const groups: { [label: string]: any[] } = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  transactions.forEach((t) => {
    const d = new Date(t.date);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - d.getTime()) / 86400000);

    let label: string;
    if (diffDays === 0) label = "Hoje";
    else if (diffDays === 1) label = "Ontem";
    else label = `${diffDays} dias atrás`;

    if (!groups[label]) groups[label] = [];
    groups[label].push(t);
  });

  return Object.entries(groups).map(([title, data]) => ({ title, data }));
}

export default function Transactions() {
  const { transactions } = useTransactions();
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<FilterPeriod>("Mês");

  const totals = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.value, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.value, 0);
    return { balance: income - expense, income, expense };
  }, [transactions]);

  const filtered = useMemo(() => {
    if (!search.trim()) return transactions;
    return transactions.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const grouped = useMemo(() => groupByDate(filtered), [filtered]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const PERIODS: FilterPeriod[] = ["Dia", "Semana", "Mês"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#E2E8F0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transações</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Transações</Text>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={16} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transações..."
            placeholderTextColor="#64748B"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.filterRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterIconBtn}>
            <Ionicons name="options-outline" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.totalsRow}>
          <View>
            <Text style={styles.totalLabel}>Total do mês</Text>
            <Text style={styles.totalBalance}>{formatCurrency(totals.balance)}</Text>
          </View>
          <View style={styles.totalStat}>
            <View style={styles.dot} />
            <View>
              <Text style={styles.totalStatLabel}>Receitas</Text>
              <Text style={[styles.totalStatValue, { color: "#4ADE80" }]}>
                + {formatCurrency(totals.income)}
              </Text>
            </View>
          </View>
          <View style={styles.totalStat}>
            <View style={[styles.dot, { backgroundColor: "#F87171" }]} />
            <View>
              <Text style={styles.totalStatLabel}>Despesas</Text>
              <Text style={[styles.totalStatValue, { color: "#F87171" }]}>
                - {formatCurrency(totals.expense)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <Text style={styles.groupLabel}>{group.title}</Text>
            <View style={styles.groupCard}>
              {group.data.map((t: any, index: number) => (
                <View key={t.id}>
                  <View style={styles.transactionRow}>
                    <View style={styles.iconWrapper}>
                      <Ionicons
                        name={
                          t.type === "income"
                            ? "briefcase-outline"
                            : getCategoryIcon(t.title)
                        }
                        size={20}
                        color={t.type === "income" ? "#4ADE80" : "#94A3B8"}
                      />
                    </View>

                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionTitle}>{t.title}</Text>
                      <Text style={styles.transactionTime}>
                        {new Date(t.date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.transactionValue,
                        t.type === "income"
                          ? styles.valueIncome
                          : styles.valueExpense,
                      ]}
                    >
                      {t.type === "income" ? "+ " : "- "}
                      {formatCurrency(t.value)}
                    </Text>
                  </View>

                  {index < group.data.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function getCategoryIcon(title: string): any {
  const t = title.toLowerCase();
  if (t.includes("mercado") || t.includes("supermercado")) return "cart-outline";
  if (t.includes("uber") || t.includes("taxi") || t.includes("transport")) return "car-outline";
  if (t.includes("netflix") || t.includes("spotify") || t.includes("stream")) return "play-circle-outline";
  if (t.includes("ifood") || t.includes("restaurante") || t.includes("food")) return "fast-food-outline";
  if (t.includes("farmácia") || t.includes("farmacia") || t.includes("saúde")) return "medkit-outline";
  if (t.includes("ginásio") || t.includes("academia")) return "barbell-outline";
  return "receipt-outline";
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F1F5F9",
    letterSpacing: 0.3,
  },

  summaryCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 12,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F172A",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  searchInput: {
    flex: 1,
    color: "#E2E8F0",
    fontSize: 14,
    padding: 0,
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  periodBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
  },
  periodBtnActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  periodBtnText: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  periodBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  filterIconBtn: {
    marginLeft: "auto",
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  totalsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  totalLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  totalBalance: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F1F5F9",
  },
  totalStat: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginTop: 4,
  },
  totalStatLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 2,
  },
  totalStatValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },

  group: {
    marginBottom: 16,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    marginLeft: 4,
  },
  groupCard: {
    backgroundColor: "#1E293B",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  transactionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
    marginBottom: 3,
  },
  transactionTime: {
    fontSize: 12,
    color: "#64748B",
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  valueIncome: {
    color: "#4ADE80",
  },
  valueExpense: {
    color: "#F87171",
  },
  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginLeft: 52,
  },
});