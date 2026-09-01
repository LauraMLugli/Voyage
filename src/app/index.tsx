import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const [senha, setSenha] = useState("123456");
  const [usuario, setUsuario] = useState("teste@test.com");

  function onClickAcessar() {
    if (usuario.trim().toLowerCase() === "teste@test.com" && senha === "123456") {
      router.navigate("/dashboard");
      return;
    }

    Alert.alert("Usuário ou senha inválido", "Verifique os dados e tente novamente.");
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logotransparente.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.titulo}>Bem-vindo</Text>
        <Text style={styles.subtitulo}>Acesse sua conta</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.inputText}>Login:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o login/email!"
          placeholderTextColor="#94A3B8"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.inputText}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a senha!"
          placeholderTextColor="#94A3B8"
          value={senha}
          secureTextEntry
          onChangeText={setSenha}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          Não tem login, {" "}
          <Link href="/register">
            <Text style={styles.textoLink}>faça o cadastro aqui!</Text>
          </Link>
        </Text>

        <Button
          onPress={onClickAcessar}
          title="Acessar"
          color="#2563EB"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  logo: {
    width: 90,
    height: 90,
  },
  titulo: {
    color: "#0F172A",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitulo: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 6,
  },
  main: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  input: {
    width: "100%",
    minHeight: 50,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#0F172A",
  },
  inputText: {
    color: "#1E293B",
    fontWeight: "700",
    fontSize: 14,
    width: "100%",
    marginBottom: 8,
  },
  footer: {
    paddingTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    color: "#475569",
    fontSize: 14,
    marginBottom: 18,
    textAlign: "center",
  },
  textoLink: {
    fontSize: 15,
    color: "#2563EB",
    fontWeight: "700",
  },
});
