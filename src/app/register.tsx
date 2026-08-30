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
        <Image
          source={require("@/assets/images/favicon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Register</Text>
        <Text style={styles.subtitulo}>Aula 17/08/2026</Text>
      </View>

      <View style={styles.main}>
        <Text style={styles.inputText}>Nome Completo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o Nome Completo!"
          placeholderTextColor="#5A8F8C"
          value={namefull}
          onChangeText={setNamefull}
        />

        <Text style={styles.inputText}>Usuário:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe o login!"
          placeholderTextColor="#5A8F8C"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />

        <Text style={styles.inputText}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Informe a senha!"
          placeholderTextColor="#5A8F8C"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <Text style={styles.inputText}>Repetir senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Repita a senha!"
          placeholderTextColor="#5A8F8C"
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

        <Button onPress={onClickAcessar} title="Registrar" color="#0F2C59" />
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
