import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { AuthContext } from "../utils/authContext";
import { BUSES } from "../utils/busData";

function Home() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  const [origin, setOrigin] = useState("Terminal Central");
  const [destination, setDestination] = useState("FATEC");

  const favoriteBuses = BUSES.filter((bus) =>
    auth.wallet.favoritos.includes(bus.line)
  );

  function planTrip() {
    if (!origin || !destination) return;

    router.navigate("/listaClientes");
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>VOYAGE MOBILIDADE</Text>

          <Text style={styles.title}>
            Olá, {auth.user?.name || "viajante"}
          </Text>

          <Text style={styles.subtitle}>
            Seu próximo destino começa aqui.
          </Text>
        </View>

        <Pressable
          style={styles.avatar}
          onPress={() => router.navigate("/perfil")}
        >
          <Text style={styles.avatarText}>
            {(auth.user?.name || "V").charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.cardLabel}>
              SALDO DISPONÍVEL
            </Text>

            <Text style={styles.balance}>
              R$ {auth.wallet.saldo.toFixed(2).replace(".", ",")}
            </Text>
          </View>

          <MaterialCommunityIcons
            name="contactless-payment"
            size={31}
            color="#d9f99d"
          />
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.cardNumber}>
            {auth.wallet.activePass
              ? `PASSE ${auth.wallet.activePass.toUpperCase()} ATIVO`
              : "NENHUM PASSE ATIVO"}
          </Text>

          <Pressable
            style={styles.topUpButton}
            onPress={() => router.navigate("/perfil")}
          >
            <Text style={styles.topUpText}>
              Recarregar
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Como você vai?
        </Text>

        <Pressable
          onPress={() => router.navigate("/listaClientes")}
        >
          <Text style={styles.link}>Ver mapa</Text>
        </Pressable>
      </View>

      <View style={styles.routeBox}>
        <View style={styles.routeLine}>
          <View style={styles.dot} />

          <TextInput
            value={origin}
            onChangeText={setOrigin}
            style={styles.routeInput}
            placeholder="De onde você sai?"
          />
        </View>

        <View style={styles.connector} />

        <View style={styles.routeLine}>
          <View
            style={[styles.dot, styles.destinationDot]}
          />

          <TextInput
            value={destination}
            onChangeText={setDestination}
            style={styles.routeInput}
            placeholder="Para onde você vai?"
          />
        </View>

        <Pressable
          style={styles.searchButton}
          onPress={planTrip}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={21}
            color="#07111f"
          />

          <Text style={styles.searchText}>
            Encontrar trajetos
          </Text>
        </Pressable>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Linhas favoritas
        </Text>
      </View>

      {favoriteBuses.length === 0 ? (
        <Pressable
          style={styles.emptyFavorites}
          onPress={() => router.navigate("/listaClientes")}
        >
          <MaterialCommunityIcons
            name="star-outline"
            size={20}
            color="#e4a11b"
          />

          <Text style={styles.emptyFavoritesText}>
            Nenhuma linha favoritada. Toque na estrela de uma
            linha no Mapa.
          </Text>
        </Pressable>
      ) : (
        favoriteBuses.map((bus) => (
          <Pressable
            key={bus.line}
            style={styles.lineRow}
            onPress={() => router.navigate("/listaClientes")}
          >
            <View style={styles.lineBadge}>
              <Text style={styles.lineBadgeText}>
                {bus.line}
              </Text>
            </View>

            <View style={styles.lineInfo}>
              <Text style={styles.lineName}>
                {bus.name}
              </Text>

              <Text style={styles.lineMeta}>
                Próximo ônibus em {bus.eta}
              </Text>
            </View>

            <Pressable
              hitSlop={8}
              onPress={() => auth.toggleFavorite(bus.line)}
            >
              <MaterialCommunityIcons
                name="star"
                size={22}
                color="#e4a11b"
              />
            </Pressable>
          </Pressable>
        ))
      )}

      <View style={styles.alert}>
        <MaterialCommunityIcons
          name="bell-ring-outline"
          size={21}
          color="#9a6200"
        />

        <Text style={styles.alertText}>
          {auth.wallet.saldo < 10
            ? "Seu saldo está baixo. Que tal fazer uma recarga?"
            : `Você tem R$ ${auth.wallet.saldo
                .toFixed(2)
                .replace(".", ",")} disponíveis para suas viagens.`}
        </Text>
      </View>
    </ScrollView>
  );
}

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7f2",
  },

  content: {
    padding: 22,
    paddingTop: 26,
    paddingBottom: 38,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  eyebrow: {
    color: "#5f7d45",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.4,
  },

  title: {
    color: "#102116",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 5,
  },

  subtitle: {
    color: "#718078",
    fontSize: 14,
    marginTop: 4,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#d8e9c7",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#315126",
    fontSize: 18,
    fontWeight: "800",
  },

  balanceCard: {
    backgroundColor: "#173d2b",
    borderRadius: 18,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#173d2b",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },

  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardLabel: {
    color: "#b9d6b0",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  balance: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 6,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },

  cardNumber: {
    color: "#b9d6b0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },

  topUpButton: {
    backgroundColor: "#d9f99d",
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 10,
  },

  topUpText: {
    color: "#173d2b",
    fontWeight: "800",
    fontSize: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#1d3024",
    fontSize: 18,
    fontWeight: "800",
  },

  link: {
    color: "#4b7f35",
    fontWeight: "800",
    fontSize: 13,
  },

  routeBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#e4e9df",
  },

  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  routeInput: {
    flex: 1,
    color: "#24352a",
    fontSize: 15,
    paddingVertical: 7,
  },

  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#5b8f43",
  },

  destinationDot: {
    backgroundColor: "#df8b3a",
  },

  connector: {
    height: 14,
    borderLeftWidth: 1,
    borderColor: "#bbc8b8",
    marginLeft: 5,
  },

  searchButton: {
    backgroundColor: "#d9f99d",
    borderRadius: 11,
    padding: 13,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginTop: 12,
  },

  searchText: {
    color: "#19371d",
    fontWeight: "800",
  },

  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e4e9df",
    marginBottom: 10,
  },

  lineBadge: {
    backgroundColor: "#286b43",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },

  lineBadgeText: {
    color: "#fff",
    fontWeight: "800",
  },

  lineInfo: {
    flex: 1,
    marginLeft: 12,
  },

  lineName: {
    color: "#24352a",
    fontWeight: "800",
    fontSize: 14,
  },

  lineMeta: {
    color: "#849187",
    fontSize: 12,
    marginTop: 4,
  },

  emptyFavorites: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#e4e9df",
    marginBottom: 15,
  },

  emptyFavoritesText: {
    flex: 1,
    color: "#6b7a6f",
    fontSize: 12,
    fontWeight: "600",
  },

  alert: {
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    backgroundColor: "#fff3d8",
    padding: 13,
    borderRadius: 12,
    marginTop: 15,
  },

  alertText: {
    flex: 1,
    color: "#76531b",
    fontSize: 12,
    fontWeight: "700",
  },
});