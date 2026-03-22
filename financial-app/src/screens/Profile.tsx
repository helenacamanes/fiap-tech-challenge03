import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../contexts/TransactionContext";
import { useGoals } from "../contexts/GoalsContext";
import { useNotifications } from "../contexts/NotificationContext";

const TERMS_TEXT = `Termos de Uso — Lighthouse Finance

Última atualização: março de 2025

1. Aceitação dos Termos
Ao usar o Lighthouse Finance, concordas com estes Termos de Uso. Se não concordares, não deves usar a aplicação.

2. Descrição do Serviço
O Lighthouse Finance é uma aplicação de gestão financeira pessoal que permite registar transações, definir metas de poupança e acompanhar o teu progresso financeiro.

3. Dados Pessoais
Os teus dados financeiros são armazenados de forma segura. Não partilhamos os teus dados com terceiros sem o teu consentimento.

4. Responsabilidade
O Lighthouse Finance é uma ferramenta de apoio à gestão financeira. Não nos responsabilizamos por decisões financeiras tomadas com base nos dados apresentados na aplicação.

5. Alterações aos Termos
Reservamo-nos o direito de atualizar estes Termos a qualquer momento. As alterações serão comunicadas através da aplicação.

6. Contacto
Para questões relacionadas com estes Termos, contacta-nos através do suporte da aplicação.`;

const PRIVACY_TEXT = `Política de Privacidade — Lighthouse Finance

Última atualização: março de 2025

1. Dados que Recolhemos
Recolhemos apenas os dados necessários para o funcionamento da aplicação:
• Email e nome para autenticação
• Transações financeiras que introduzes
• Metas de poupança que defines

2. Como Usamos os Dados
Os teus dados são usados exclusivamente para:
• Mostrar o teu histórico financeiro
• Calcular estatísticas e relatórios pessoais
• Enviar notificações que autorizaste

3. Armazenamento
Os dados são armazenados de forma segura na Firebase (Google Cloud), com encriptação em trânsito e em repouso.

4. Partilha de Dados
Não vendemos nem partilhamos os teus dados pessoais com terceiros para fins comerciais.

5. Os Teus Direitos
Tens o direito de:
• Aceder aos teus dados
• Corrigir dados incorretos
• Eliminar a tua conta e todos os dados associados

6. Cookies e Rastreamento
Não usamos cookies de rastreamento de terceiros.

7. Contacto
Para exerceres os teus direitos ou colocares questões sobre privacidade, contacta-nos pelo suporte da aplicação.`;

function LegalModal({
  visible,
  title,
  content,
  onClose,
}: {
  visible: boolean;
  title: string;
  content: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <TouchableOpacity
          style={modalStyles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <SafeAreaView style={modalStyles.sheet}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>{title}</Text>
            <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={modalStyles.scrollArea}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={modalStyles.scrollContent}
          >
            <Text style={modalStyles.content}>{content}</Text>
          </ScrollView>

          <TouchableOpacity style={modalStyles.confirmBtn} onPress={onClose}>
            <Text style={modalStyles.confirmBtnText}>Entendi</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function Profile() {
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const { dailyReminderEnabled, toggleDailyReminder } = useNotifications();

  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);

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
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.screenTitle}>Perfil</Text>

        <View style={styles.card}>
          <Text style={styles.cardSectionTitle}>Perfil</Text>

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

          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons name="notifications-outline" size={18} color="#94A3B8" />
              </View>
              <View>
                <Text style={styles.menuLabel}>Notificações</Text>
                <Text style={styles.menuSubLabel}>
                  {dailyReminderEnabled ? "Lembrete às 21h ativo" : "Desativado"}
                </Text>
              </View>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={toggleDailyReminder}
              trackColor={{ false: "#334155", true: "#2563EB" }}
              thumbColor={dailyReminderEnabled ? "#FFFFFF" : "#64748B"}
            />
          </View>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
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
            Ilumine sua vida financeira com clareza e controle. Como um farol
            guia navios no oceano, o Lighthouse guia suas decisões financeiras.
          </Text>

          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => setTermsVisible(true)}>
              <Text style={styles.linkText}>Termos de uso</Text>
            </TouchableOpacity>
            <Text style={styles.linkDot}>·</Text>
            <TouchableOpacity onPress={() => setPrivacyVisible(true)}>
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

      <LegalModal
        visible={termsVisible}
        title="Termos de uso"
        content={TERMS_TEXT}
        onClose={() => setTermsVisible(false)}
      />
      <LegalModal
        visible={privacyVisible}
        title="Política de privacidade"
        content={PRIVACY_TEXT}
        onClose={() => setPrivacyVisible(false)}
      />
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
    flex: 1,
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
  menuSubLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#334155",
    marginVertical: 10,
    marginLeft: 48,
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    borderTopWidth: 1,
    borderColor: "#334155",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F1F5F9",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 22,
  },
  confirmBtn: {
    margin: 16,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});