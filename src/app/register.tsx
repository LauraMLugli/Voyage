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

export default function Register() {
  const router = useRouter();
  const [namefull, setNamefull] = useState("    ");
  const [senha, setSenha] = useState("123456");
  const [senha2, setSenha2] = useState("123456");
  const [usuario, setUsuario] = useState("teste@test.com");

  function onClickAcessar() {
    if (namefull.trim() === "") {
      Alert.alert("Campo obrigatório", "Informe o nome completo para continuar.");
      return;
    }

    if (usuario.trim() === "") {
      Alert.alert("Campo obrigatório", "Informe o usuário para continuar.");
      return;
    }

    if (senha !== senha2) {
      Alert.alert("Senhas diferentes", "As senhas informadas não coincidem.");
      return;
    }

    router.navigate("/");
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
        <Text style={styles.titulo}>Crie sua conta</Text>
        <Text style={styles.subtitulo}>Cadastro rápido e seguro</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.inputText}>Nome Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o Nome Completo!"
          placeholderTextColor="#94A3B8"
          value={namefull}
          onChangeText={setNamefull}
        />

        <Text style={styles.inputText}>Usuário:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o login!"
          placeholderTextColor="#94A3B8"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.inputText}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a senha!"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.inputText}>Repetir senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha!"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={senha2}
          onChangeText={setSenha2}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          Já possui cadastro, {" "}
          <Link href="/">
            <Text style={styles.textoLink}>faça o login!</Text>
          </Link>
        </Text>

        <Button onPress={onClickAcessar} title="Registrar" color="#2563EB" />
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
