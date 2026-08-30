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
        <Image
          source={require("@/assets/images/logotransparente.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Login</Text>
        <Text style={styles.subtitulo}>Aula 17/08/2026</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.inputText}>Login:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o login/email!"
          placeholderTextColor="#5A8F8C"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.inputText}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a senha!"
          placeholderTextColor="#5A8F8C"
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
          color="#0F2C59"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0FAF9",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#C8E6C9",
    marginBottom: 12,
  },
  logo: {
    width: 88,
    height: 88,
    marginBottom: 12,
  },
  titulo: {
    color: "#0F2C59",
    fontSize: 30,
    fontWeight: "700",
  },
  subtitulo: {
    color: "#1B5E20",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  main: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#E0F2F1",
    borderWidth: 1,
    borderColor: "#A3C4BC",
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: "#0F2C59",
  },
  inputText: {
    color: "#0F2C59",
    fontWeight: "600",
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
    color: "#333333",
    fontSize: 14,
    marginBottom: 18,
    textAlign: "center",
  },
  textoLink: {
    fontSize: 15,
    color: "#00C9A7",
    fontWeight: "700",
  },
});
