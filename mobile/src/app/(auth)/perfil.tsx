import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../utils/authContext";

const PASS_PRICES: Record<string, number> = {
  Único: 5,
  Diário: 12,
  Mensal: 120,
  Regional: 18,
};

function Perfil() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState(20);

  function logout() {
    auth.logOut();
    router.replace("/login");
  }

  async function onRecharge() {
    await auth.recharge(selectedAmount);
    Alert.alert("Recarga concluída", `Seu saldo foi atualizado em R$ ${selectedAmount},00.`);
  }

  async function onActivatePass(pass: string) {
    const price = PASS_PRICES[pass];
    const result = await auth.activatePass(pass, price);
    if (!result.ok) {
      Alert.alert("Não foi possível ativar", result.message || "Tente novamente.");
      return;
    }
    Alert.alert("Passe ativado!", `Passe ${pass} ativo por R$ ${price.toFixed(2).replace(".", ",")}.`);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>MINHA CARTEIRA</Text>
          <Text style={styles.title}>Cartão e passes</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <MaterialCommunityIcons name="logout" size={18} color="#286b43" />
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}><Text style={styles.cardBrand}>VOYAGE</Text><MaterialCommunityIcons name="contactless-payment" size={26} color="#d9f99d" /></View>
        <Text style={styles.cardName}>{auth.user?.name || "Usuário Voyage"}</Text>
        <Text style={styles.cardNumber}>5489  ••••  ••••  0842</Text>
        <View style={styles.cardFooter}><Text style={styles.cardType}>CARTÃO DIGITAL</Text><Text style={styles.cardStatus}>ATIVO</Text></View>
      </View>

      <View style={styles.balanceRow}>
        <View><Text style={styles.label}>Saldo atual</Text><Text style={styles.balance}>R$ {auth.wallet.saldo.toFixed(2).replace(".", ",")}</Text></View>
        <MaterialCommunityIcons name="wallet-outline" size={27} color="#4b7f35" />
      </View>

      <Text style={styles.sectionTitle}>Recarregar cartão</Text>
      <View style={styles.amounts}>
        {[10, 20, 50, 100].map((amount) => (
          <Pressable key={amount} onPress={() => setSelectedAmount(amount)} style={[styles.amount, selectedAmount === amount && styles.amountSelected]}>
            <Text style={[styles.amountText, selectedAmount === amount && styles.amountTextSelected]}>R$ {amount}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.rechargeButton} onPress={onRecharge}>
        <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#16371c" />
        <Text style={styles.rechargeText}>Continuar recarga</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Passe ativo</Text>
      <View style={styles.pass}>
        <View style={styles.passIcon}><MaterialCommunityIcons name="calendar-check" size={22} color="#fff" /></View>
        <View style={styles.passInfo}>
          <Text style={styles.passName}>{auth.wallet.activePass || "Nenhum passe ativo"}</Text>
          <Text style={styles.passMeta}>
            {auth.wallet.activePass ? `Válido até ${auth.wallet.passExpiry}` : "Ative um passe abaixo"}
          </Text>
        </View>
        {auth.wallet.activePass && <Text style={styles.passPrice}>ATIVO</Text>}
      </View>
      <View style={styles.passOptions}>
        {Object.keys(PASS_PRICES).map((pass) => (
          <Pressable key={pass} onPress={() => onActivatePass(pass)} style={[styles.passOption, auth.wallet.activePass === pass && styles.passOptionActive]}>
            <Text style={[styles.passOptionText, auth.wallet.activePass === pass && styles.passOptionTextActive]}>
              {pass} · R$ {PASS_PRICES[pass].toFixed(2).replace(".", ",")}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Últimas movimentações</Text>
      {auth.wallet.historico.length === 0 ? (
        <Text style={styles.emptyHistory}>Nenhuma movimentação ainda.</Text>
      ) : (
        auth.wallet.historico.map((t) => (
          <View style={styles.transaction} key={t.id}>
            <MaterialCommunityIcons
              name={t.value >= 0 ? "arrow-down-circle" : "bus"}
              size={21}
              color={t.value >= 0 ? "#4b7f35" : "#77857a"}
            />
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{t.title}</Text>
              <Text style={styles.transactionDate}>{t.date}</Text>
            </View>
            <Text style={[styles.transactionValue, t.value >= 0 && styles.credit]}>
              {t.value >= 0 ? "+ " : "- "}R$ {Math.abs(t.value).toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

export default Perfil;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f7f2" }, content: { padding: 22, paddingTop: 26, paddingBottom: 38 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  logoutButton: { backgroundColor: "#fff", padding: 10, borderRadius: 12, borderWidth: 1, borderColor: "#e4e9df" },
  eyebrow: { color: "#5f7d45", fontSize: 11, fontWeight: "800", letterSpacing: 1.4 }, title: { color: "#102116", fontSize: 28, fontWeight: "800", marginTop: 5, marginBottom: 20 }, card: { backgroundColor: "#173d2b", borderRadius: 18, padding: 20, minHeight: 175 }, cardHeader: { flexDirection: "row", justifyContent: "space-between" }, cardBrand: { color: "#d9f99d", fontWeight: "900", letterSpacing: 2 }, cardName: { color: "#fff", fontSize: 17, fontWeight: "700", marginTop: 28 }, cardNumber: { color: "#b9d6b0", marginTop: 5, letterSpacing: 1.5 }, cardFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 }, cardType: { color: "#8db286", fontSize: 10, fontWeight: "800" }, cardStatus: { color: "#d9f99d", fontSize: 10, fontWeight: "800" }, balanceRow: { backgroundColor: "#fff", borderRadius: 14, padding: 17, marginTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "#e4e9df" }, label: { color: "#849187", fontSize: 12 }, balance: { color: "#24352a", fontSize: 24, fontWeight: "800", marginTop: 3 }, sectionTitle: { color: "#1d3024", fontSize: 18, fontWeight: "800", marginTop: 25, marginBottom: 12 }, amounts: { flexDirection: "row", gap: 8 }, amount: { flex: 1, backgroundColor: "#fff", paddingVertical: 13, borderRadius: 11, alignItems: "center", borderWidth: 1, borderColor: "#e1e9dc" }, amountSelected: { backgroundColor: "#d9f99d", borderColor: "#9fc26e" }, amountText: { color: "#58665c", fontWeight: "800", fontSize: 13 }, amountTextSelected: { color: "#23471f" }, rechargeButton: { backgroundColor: "#d9f99d", padding: 14, borderRadius: 11, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7, marginTop: 10 }, rechargeText: { color: "#16371c", fontWeight: "800" }, pass: { backgroundColor: "#fff", borderRadius: 15, padding: 14, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#e4e9df" }, passIcon: { backgroundColor: "#4b7f35", padding: 10, borderRadius: 11 }, passInfo: { flex: 1, marginLeft: 11 }, passName: { color: "#24352a", fontWeight: "800", fontSize: 15 }, passMeta: { color: "#849187", fontSize: 11, marginTop: 4 }, passPrice: { color: "#4b7f35", fontSize: 11, fontWeight: "900" }, passOptions: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 9 }, passOption: { borderRadius: 9, paddingVertical: 8, paddingHorizontal: 10, backgroundColor: "#e8eee4" }, passOptionActive: { backgroundColor: "#286b43" }, passOptionText: { color: "#67756a", fontSize: 11, fontWeight: "700" }, passOptionTextActive: { color: "#fff" }, transaction: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: "#edf0eb" }, transactionInfo: { flex: 1, marginLeft: 10 }, transactionName: { color: "#34453a", fontWeight: "700", fontSize: 13 }, transactionDate: { color: "#9aa59c", fontSize: 11, marginTop: 3 }, transactionValue: { color: "#59665c", fontSize: 13, fontWeight: "800" }, credit: { color: "#4b7f35" }, emptyHistory: { color: "#849187", fontSize: 12, fontStyle: "italic" },
});