import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type TabKey = "inicio" | "mapa" | "carteira";

type Transaction = {
  id: number;
  title: string;
  time: string;
  amount: number;
  positive: boolean;
  icon: string;
  ride?: boolean;
};

const pageTitles: Record<TabKey, string> = {
  inicio: "Para onde você vai?",
  mapa: "Mapa em tempo real",
  carteira: "Minha carteira",
};

const tabs: Array<{
  key: TabKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}> = [
  { key: "inicio", label: "Início", icon: "home" },
  { key: "mapa", label: "Mapa", icon: "map" },
  { key: "carteira", label: "Carteira", icon: "wallet" },
];

export default function DashBoard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("inicio");
  const [search, setSearch] = useState("");
  const [balance, setBalance] = useState(42.5);
  const [modalVisible, setModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState("20");
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      title: "Recarga",
      time: "Hoje, 14:20",
      amount: 20,
      positive: true,
      icon: "plus",
    },
    {
      id: 2,
      title: "Viagem — Linha 305",
      time: "Hoje, 09:12",
      amount: 5,
      positive: false,
      icon: "bus",
      ride: true,
    },
  ]);

  function logout() {
    router.navigate("/");
  }

  function searchLine() {
    if (!search.trim()) {
      Alert.alert("Digite uma linha ou destino.");
      return;
    }

    Alert.alert("Busca", `Buscando informações para "${search.trim()}"...`);
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function recharge() {
    const amount = Number(customAmount);

    if (!amount || amount <= 0) {
      Alert.alert("Valor inválido", "Digite um valor válido para recarga.");
      return;
    }

    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      {
        id: Date.now(),
        title: "Recarga",
        time: "Agora",
        amount,
        positive: true,
        icon: "plus",
      },
      ...prev,
    ]);
    setCustomAmount("");
    setModalVisible(false);
    Alert.alert(
      "Recarga realizada",
      `Recarga de ${formatCurrency(amount)} realizada!`,
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logotransparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => Alert.alert("Notificações", "Você tem 3 avisos novos.")}
        >
          <MaterialCommunityIcons name="bell" size={20} color="#172033" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Boa tarde 👋</Text>
        <Text style={styles.pageTitle}>{pageTitles[activeTab]}</Text>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
            >
              <MaterialCommunityIcons
                name={tab.icon}
                size={18}
                color={activeTab === tab.key ? "#F97316" : "#64748B"}
              />
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === "inicio" && (
          <>
            <View style={styles.searchBox}>
              <MaterialIcons name="search" size={20} color="#64748B" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Digite uma linha ou destino..."
                placeholderTextColor="#64748B"
                style={styles.searchInput}
                onSubmitEditing={searchLine}
              />
              <TouchableOpacity style={styles.searchButton} onPress={searchLine}>
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardsGrid}>
              <View style={[styles.infoCard, styles.balanceCard]}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardLabelLight}>Saldo da carteira</Text>
                  <MaterialCommunityIcons name="wallet" size={18} color="#fff" />
                </View>
                <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
                <TouchableOpacity style={styles.cardAction} onPress={() => setModalVisible(true)}>
                  <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                  <Text style={styles.cardActionText}>Recarregar</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardLabel}>Ônibus próximos</Text>
                  <MaterialCommunityIcons name="bus" size={18} color="#172033" />
                </View>
                <Text style={styles.cardValue}>4</Text>
                <Text style={styles.cardText}>ônibus chegando perto de você</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardLabel}>Próxima viagem</Text>
                  <MaterialCommunityIcons name="navigation" size={18} color="#172033" />
                </View>
                <Text style={styles.cardValue}>12 min</Text>
                <Text style={styles.cardText}>Linha 305 — Centro</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Ônibus próximos</Text>
                <Text style={styles.sectionSubtitle}>Acompanhe os veículos em tempo real</Text>
              </View>
              <TouchableOpacity style={styles.outlineButton} onPress={() => setActiveTab("mapa")}>
                <Text style={styles.outlineButtonText}>Ver mapa</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#172033" />
              </TouchableOpacity>
            </View>

            <View style={styles.mapBox}>
              <View style={styles.road1} />
              <View style={styles.road2} />
              <View style={styles.road3} />
              <View style={styles.route1} />
              <View style={styles.locationUser}><View style={styles.locationDot} /></View>
              <Text style={[styles.mapLabel, styles.label1]}>Centro</Text>
              <Text style={[styles.mapLabel, styles.label2]}>Terminal</Text>
              <Text style={[styles.mapLabel, styles.label3]}>Vila Nova</Text>
              <View style={[styles.busMarker, styles.bus1]}><Text style={styles.busEmoji}>🚌</Text></View>
              <View style={[styles.busMarker, styles.bus2]}><Text style={styles.busEmoji}>🚌</Text></View>
              <View style={[styles.busMarker, styles.bus3]}><Text style={styles.busEmoji}>🚌</Text></View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Suas linhas</Text>
                <Text style={styles.sectionSubtitle}>Linhas utilizadas recentemente</Text>
              </View>
            </View>

            <View style={styles.linesGrid}>
              <View style={styles.lineCard}>
                <View style={styles.lineNumber}><Text style={styles.lineNumberText}>305</Text></View>
                <View style={styles.lineInfo}>
                  <Text style={styles.lineTitle}>Centro → Terminal</Text>
                  <Text style={styles.lineMeta}>Próximo ônibus em 12 min</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#172033" />
              </View>

              <View style={styles.lineCard}>
                <View style={styles.lineNumber}><Text style={styles.lineNumberText}>402</Text></View>
                <View style={styles.lineInfo}>
                  <Text style={styles.lineTitle}>Vila Nova → Centro</Text>
                  <Text style={styles.lineMeta}>Próximo ônibus em 18 min</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={18} color="#172033" />
              </View>
            </View>
          </>
        )}

        {activeTab === "mapa" && (
          <>
            <View style={styles.sectionRow}>
              <View>
                <Text style={styles.sectionTitle}>Mapa em tempo real</Text>
                <Text style={styles.sectionSubtitle}>Acompanhe os ônibus da cidade</Text>
              </View>
              <TouchableOpacity style={styles.locationButton}>
                <MaterialCommunityIcons name="crosshairs" size={18} color="#fff" />
                <Text style={styles.locationButtonText}>Minha localização</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bigMapBox}>
              <View style={styles.locationUserBig}><View style={styles.locationDot} /></View>
              <View style={[styles.busMarker, styles.busA]}><Text style={styles.busEmoji}>🚌</Text></View>
              <View style={[styles.busMarker, styles.busB]}><Text style={styles.busEmoji}>🚌</Text></View>
              <View style={[styles.busMarker, styles.busC]}><Text style={styles.busEmoji}>🚌</Text></View>
              <Text style={[styles.mapPlace, styles.placeCenter]}>Centro</Text>
              <Text style={[styles.mapPlace, styles.placeTerminal]}>Terminal</Text>
              <Text style={[styles.mapPlace, styles.placeVila]}>Vila Nova</Text>
            </View>

            <View style={styles.busList}>
              <Text style={styles.busListTitle}>Ônibus próximos</Text>

              {[
                { line: "305", route: "Centro → Terminal", time: "12 min" },
                { line: "402", route: "Vila Nova → Centro", time: "18 min" },
                { line: "110", route: "Terminal → Jardim", time: "24 min" },
              ].map((item) => (
                <View key={item.line} style={styles.busItem}>
                  <View style={styles.busIconContainer}>
                    <MaterialCommunityIcons name="bus" size={18} color="#F97316" />
                  </View>
                  <View style={styles.busTextBlock}>
                    <Text style={styles.busLine}>Linha {item.line}</Text>
                    <Text style={styles.busRoute}>{item.route}</Text>
                  </View>
                  <Text style={styles.arrivalText}>{item.time}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === "carteira" && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Minha carteira</Text>
                <Text style={styles.sectionSubtitle}>Gerencie seu cartão de transporte</Text>
              </View>
            </View>

            <View style={styles.digitalCard}>
              <View style={styles.cardBrandRow}>
                <Image
                  source={require("@/assets/images/logotransparente.png")}
                  style={styles.brandLogoSmall}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.cardNumber}>•••• •••• •••• 4821</Text>

              <View style={styles.digitalCardFooter}>
                <View>
                  <Text style={styles.cardFooterLabel}>Saldo</Text>
                  <Text style={styles.cardFooterValue}>{formatCurrency(balance)}</Text>
                </View>
                <View>
                  <Text style={styles.cardFooterLabel}>Tipo</Text>
                  <Text style={styles.cardFooterValue}>Transporte</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Recarregar carteira</Text>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Histórico</Text>
                <Text style={styles.sectionSubtitle}>Últimas movimentações</Text>
              </View>
            </View>

            <View style={styles.transactionsList}>
              {transactions.map((item) => (
                <View key={item.id} style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, item.ride && styles.transactionRideIcon]}>
                    <MaterialCommunityIcons
                      name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                      size={18}
                      color={item.ride ? "#172033" : "#F97316"}
                    />
                  </View>
                  <View style={styles.transactionTextBlock}>
                    <Text style={styles.transactionTitle}>{item.title}</Text>
                    <Text style={styles.transactionTime}>{item.time}</Text>
                  </View>
                  <Text style={[styles.transactionValue, item.positive ? styles.positive : styles.negative]}>
                    {item.positive ? "+ " : "- "}{formatCurrency(item.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons name="close" size={18} color="#172033" />
            </TouchableOpacity>

            <View style={styles.modalIcon}>
              <MaterialCommunityIcons name="wallet" size={24} color="#F97316" />
            </View>

            <Text style={styles.modalTitle}>Recarregar carteira</Text>
            <Text style={styles.modalText}>Escolha o valor que deseja adicionar.</Text>

            <View style={styles.amountGrid}>
              {[10, 20, 30, 50].map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={styles.amountButton}
                  onPress={() => {
                    setCustomAmount(String(amount));
                  }}
                >
                  <Text style={styles.amountButtonText}>R$ {amount}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.customAmountBox}>
              <Text style={styles.currencyLabel}>R$</Text>
              <TextInput
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
                placeholder="Outro valor"
                placeholderTextColor="#64748B"
                style={styles.customInput}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={recharge}>
              <Text style={styles.primaryButtonText}>Confirmar recarga</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.footerButton} onPress={() => logout()}>
          <MaterialCommunityIcons name="logout" size={18} color="#fff" />
          <Text style={styles.footerButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0FAF9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  logo: {
    width: 120,
    height: 36,
  },
  notificationButton: {
    position: "relative",
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F97316",
    right: 10,
    top: 9,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  greeting: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172033",
    marginBottom: 18,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 6,
    marginBottom: 18,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTabButton: {
    backgroundColor: "#FFF7ED",
  },
  tabText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#F97316",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    color: "#172033",
    paddingHorizontal: 10,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  cardsGrid: {
    gap: 12,
    marginBottom: 18,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    minHeight: 160,
  },
  balanceCard: {
    backgroundColor: "#172033",
    borderColor: "#172033",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  cardLabelLight: {
    color: "#CBD5E1",
    fontSize: 12,
    fontWeight: "600",
  },
  balanceValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700",
    marginTop: 18,
  },
  cardAction: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  cardActionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  cardValue: {
    color: "#172033",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 18,
  },
  cardText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#172033",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSubtitle: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 4,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  outlineButtonText: {
    color: "#172033",
    fontSize: 12,
    fontWeight: "600",
  },
  mapBox: {
    position: "relative",
    height: 280,
    backgroundColor: "#EEF2F4",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  road1: {
    position: "absolute",
    width: "115%",
    height: 36,
    left: -20,
    top: "44%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    transform: [{ rotate: "-10deg" }],
  },
  road2: {
    position: "absolute",
    width: "115%",
    height: 32,
    left: -10,
    top: "68%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    transform: [{ rotate: "20deg" }],
  },
  road3: {
    position: "absolute",
    width: 32,
    height: "120%",
    left: "60%",
    top: -20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    transform: [{ rotate: "20deg" }],
  },
  route1: {
    position: "absolute",
    width: 230,
    height: 120,
    left: "26%",
    top: "22%",
    borderWidth: 4,
    borderColor: "#F97316",
    borderRadius: 100,
  },
  locationUser: {
    position: "absolute",
    left: "48%",
    top: "55%",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(249,115,22,0.16)",
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#2563EB",
    borderWidth: 2,
    borderColor: "#fff",
  },
  busMarker: {
    position: "absolute",
    width: 38,
    height: 38,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
  },
  busEmoji: {
    fontSize: 18,
  },
  bus1: {
    left: "37%",
    top: "35%",
  },
  bus2: {
    left: "66%",
    top: "50%",
  },
  bus3: {
    left: "56%",
    top: "74%",
  },
  mapLabel: {
    position: "absolute",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 11,
    color: "#172033",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  label1: { left: "23%", top: "24%" },
  label2: { right: "18%", top: "38%" },
  label3: { left: "60%", bottom: "12%" },
  linesGrid: {
    gap: 12,
    marginBottom: 12,
  },
  lineCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
  },
  lineNumber: {
    width: 46,
    height: 46,
    backgroundColor: "#FFF7ED",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  lineNumberText: {
    color: "#F97316",
    fontWeight: "700",
  },
  lineInfo: {
    flex: 1,
  },
  lineTitle: {
    color: "#172033",
    fontSize: 13,
    fontWeight: "700",
  },
  lineMeta: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F97316",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  locationButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  bigMapBox: {
    position: "relative",
    height: 360,
    borderRadius: 18,
    backgroundColor: "#EEF2F4",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  locationUserBig: {
    position: "absolute",
    left: "48%",
    top: "54%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(249,115,22,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  busA: { left: "33%", top: "32%" },
  busB: { left: "67%", top: "42%" },
  busC: { left: "58%", top: "72%" },
  mapPlace: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    color: "#172033",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  placeCenter: { left: "22%", top: "24%" },
  placeTerminal: { right: "18%", top: "40%" },
  placeVila: { left: "56%", bottom: "16%" },
  busList: {
    marginTop: 20,
  },
  busListTitle: {
    color: "#172033",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  busItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  busIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  busTextBlock: { flex: 1, marginLeft: 12 },
  busLine: {
    color: "#172033",
    fontSize: 13,
    fontWeight: "700",
  },
  busRoute: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 4,
  },
  arrivalText: {
    color: "#F97316",
    fontWeight: "700",
    fontSize: 12,
  },
  digitalCard: {
    backgroundColor: "#172033",
    borderRadius: 24,
    padding: 22,
    minHeight: 220,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardBrandRow: {
    alignItems: "flex-start",
  },
  brandLogoSmall: {
    width: 110,
    height: 32,
  },
  cardNumber: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "600",
  },
  digitalCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardFooterLabel: {
    color: "#94A3B8",
    fontSize: 10,
    marginBottom: 4,
  },
  cardFooterValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#F97316",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  transactionsList: {
    marginTop: 10,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  transactionRideIcon: {
    backgroundColor: "#F1F5F9",
  },
  transactionTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: "#172033",
    fontSize: 12,
    fontWeight: "700",
  },
  transactionTime: {
    color: "#64748B",
    fontSize: 10,
    marginTop: 4,
  },
  transactionValue: {
    fontWeight: "700",
    fontSize: 12,
  },
  positive: { color: "#16A34A" },
  negative: { color: "#DC2626" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 18,
    top: 18,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  modalTitle: {
    color: "#172033",
    fontSize: 20,
    fontWeight: "700",
  },
  modalText: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 18,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  amountButton: {
    flexBasis: "23%",
    paddingVertical: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  amountButtonText: {
    color: "#172033",
    fontWeight: "600",
    fontSize: 12,
  },
  customAmountBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  currencyLabel: {
    color: "#172033",
    fontSize: 15,
    fontWeight: "600",
  },
  customInput: {
    flex: 1,
    color: "#172033",
    fontSize: 15,
  },
  footerActions: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    backgroundColor: "#F0FAF9",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0F2C59",
    borderRadius: 12,
    paddingVertical: 14,
  },
  footerButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
