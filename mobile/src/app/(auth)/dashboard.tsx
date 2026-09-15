import { ButtonFatec } from "@/components/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../utils/authContext";

export default function DashBoard() {
  const route = useRouter();
  const auth = useContext(AuthContext);

  function logout() {
    auth.logOut();
    route.replace("/login");
  }
  function openCadastros() {
    route.navigate("/register");
  }
  function newRegister() {
    route.navigate("/register");
  }
  function deleteRegister() {
    Alert.alert(
      "Excluir cadastro",
      "Deseja realmente sair e remover a sessão atual deste dispositivo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", style: "destructive", onPress: logout },
      ],
    );
  }

  return (
    <View style={{ flex: 1, padding: 5, gap: 5, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        <Image source={require("@/assets/images/logotransparente.png")} style={styles.logo} />
        <Text style={styles.titulo}>Dashboard</Text>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          Olá, {auth.user?.name || "viajante"}
        </Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.inputText}>tela principal</Text>
      </View>
      <View style={styles.footer}>
        <ButtonFatec
          text={"sair"}
          action={logout}
          icon={MaterialCommunityIcons}
          iconName={"exit-run"}
        />
        <ButtonFatec
          text={"cadastros"}
          action={openCadastros}
          icon={MaterialCommunityIcons}
          iconName={"account-plus"}
        />
        <ButtonFatec
          text={"Novo"}
          action={newRegister}
          icon={MaterialCommunityIcons}
          iconName={"plus-circle"}
        />
        <ButtonFatec
          text={"Excluir"}
          action={deleteRegister}
          icon={MaterialIcons}
          iconName={"delete-outline"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 118,
    height: 118,
    resizeMode: "contain",
  },
  container: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    color: "#000",
    fontSize: 28,
    fontWeight: 600,
  },
  main: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 36,
    backgroundColor: "#999",
    marginBottom: 15,
    borderRadius: 10,
  },
  inputText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 12,
    width: "100%",
    marginBottom: 5,
  },
  footer: {
    flex: 1 / 3,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
});