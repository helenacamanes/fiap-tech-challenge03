import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTransactions } from "../contexts/TransactionContext";
import { useGoals } from "../contexts/GoalsContext";

export default function Profile() {
  const navigation = useNavigation();
  const { transactions } = useTransactions();
  const { goals } = useGoals();

  const totalTransactions = transactions.length;
  const activeGoals = goals.filter((g) => g.current < g.target).length;
  const daysOfUse = 45;

  function handleLogout() {
    Alert.alert("Sair da conta", "Tens a certeza que queres sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          // chamar signOut do AuthContext aqui
          // ex: signOut();
        },
      },
    ]);
  }

  function handleNotifications() {
    // navegar para tela de notificações
  }

  function handleChangePassword() {
    // navegar para tela de alterar senha
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.screenTitle}>Perfil</Text>

        {/* ── Profile Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Perfil</Text>

          {/* Avatar + Info */}
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>L</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Larissa Akemi</Text>
              <Text style={styles.profileEmail}>larissa@email.com</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalTransactions}</Text>
              <Text style={styles.statLabel}>Transações</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#3B82F6" }]}>
                {activeGoals}
              </Text>
              <Text style={styles.statLabel}>Metas ativas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>
                {daysOfUse}
              </Text>
              <Text style={styles.statLabel}>Dias de uso</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Configurações</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleNotifications}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons name="notifications-outline" size={18} color="#94A3B8" />
              </View>
              <Text style={styles.menuLabel}>Notificações</Text>
            </View>
            <View style={styles.menuRight}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>8</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#475569" />
            </View>
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleChangePassword}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" />
              </View>
              <Text style={styles.menuLabel}>Alterar senha</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Sobre o Lighthouse</Text>
          <Text style={styles.aboutText}>
            Ilumine suas vida financeira com clareza e controle. Como um farol
            guia navios no oceano, o Lighthouse guia suas decisões financeiras.
          </Text>

          <View style={styles.linksRow}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Termos de uso</Text>
            </TouchableOpacity>
            <Text style={styles.linkDot}>·</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Política de privacidade</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>Versão 1.0.0</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#F87171" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F1F5F9",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 16,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 13,
    color: "#64748B",
  },

  divider: {
    height: 1,
    backgroundColor: "#334155",
    marginBottom: 16,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F1F5F9",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#334155",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E2E8F0",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 10,
    marginLeft: 48,
  },
  notificationBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 999,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  aboutText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 14,
  },
  linksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
  linkDot: {
    color: "#475569",
    fontSize: 12,
  },
  versionText: {
    fontSize: 12,
    color: "#475569",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1E293B",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#334155",
    marginTop: 4,
  },
  logoutText: {
    color: "#F87171",
    fontWeight: "700",
    fontSize: 15,
  },
});