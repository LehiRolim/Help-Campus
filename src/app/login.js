import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import estilo from "@/styles/styles";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/services/firebase";
import { contasDemo } from "@/services/contas-demo";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { estilosEscuros } from '@/styles/styles';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const { modoEscuro } = useTheme();
  const estilosClarosLogin = Object.fromEntries(
  Object.keys(estilosEscuros).map((chave) => [chave, undefined])
);
  const tema = modoEscuro ? estilosEscuros : estilosClarosLogin;
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  const matriculaInformada = matricula.trim();

  if (!matriculaInformada || !senha.trim()) {
    Alert.alert("Atenção", "Preencha a matrícula e a senha.");
    return;
  }

  if (!/^\d{6,}$/.test(senha)) {
    Alert.alert("Atenção", "A senha deve conter apenas números e ter no mínimo 6 dígitos.");
    return;
  }

  const conta = /** @type {Record<string, { email: string, perfil: string }>} */ (contasDemo)[matriculaInformada];

  setLoading(true);

  try {
    const emailAutenticacao = conta
      ? conta.email
      : `${matriculaInformada}@helpcampus.demo`;

    const resultado = await signInWithEmailAndPassword(
      auth,
      emailAutenticacao,
      senha
    );

    const perfilDoc = await getDoc(doc(db, "usuarios", resultado.user.uid));

    const perfil = perfilDoc.exists()
      ? perfilDoc.data().perfil
      : conta?.perfil;

    if (perfil === "funcionario" || perfil === "responsavel") {
      router.replace("/responsavel");
    } else if (perfil === "aluno" || perfil === "professor") {
      router.replace("/ocorrencias");
    } else {
      await signOut(auth);
      throw new Error("Perfil de usuário não encontrado.");
    }
  } catch (erro) {
    const codigo = erro instanceof Error && "code" in erro
      ? String(erro.code)
      : erro instanceof Error
        ? erro.message
        : "erro-desconhecido";

    console.error("LOGIN FIREBASE:", codigo, erro);

    if (Platform.OS === "web") {
      window.alert(`Erro no login: ${codigo}`);
    } else {
      Alert.alert("Erro no login", codigo);
    }
  } finally {
    setLoading(false);
  }
};

  return (
  <KeyboardAvoidingView
    style={[estilo.container, tema.container]}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={estilo.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={estilo.headerContainer}>
          <Text style={[estilo.tituloLogo, tema.tituloLogo]}>
            Help Campus
          </Text>
        </View>

        <View style={estilo.formContainer}>
          <TextInput
            style={[estilo.input, tema.input]}
            placeholder="Matrícula"
            placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
            value={matricula}
            onChangeText={setMatricula}
            keyboardType="numeric"
            autoCapitalize="none"
          />

          <View style={estilo.passwordContainer}>
            <TextInput
              style={[estilo.input, estilo.inputPassword, tema.input]}
              placeholder="Senha"
              placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              style={estilo.eyeIcon}
              onPress={() => setMostrarSenha(!mostrarSenha)}
            >
              <MaterialCommunityIcons
                name={mostrarSenha ? "eye-outline" : "eye-off-outline"}
                size={22}
                color={modoEscuro ? "#FFFFFF" : "#000000"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Recuperação", "Função de redefinição de senha.")
            }
          >
            <Text style={estilo.esqueceuSenhaText}>
              Esqueceu sua senha ?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilo.botaoAcessar, tema.botaoAcessar]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={modoEscuro ? "#FFFFFF" : "#1E3A8A"} />
            ) : (
              <Text style={[estilo.textoBotaoAcessar, tema.textoBotaoAcessar]}>
                Acessar
              </Text>
            )}
          </TouchableOpacity>

          <Text style={[estilo.divisorTexto, tema.divisorTexto]}>
            ou
          </Text>

          <TouchableOpacity
            style={estilo.linkCadastrar}
            onPress={() => router.push("/cadastro")}
          >
            <Text style={estilo.textoCadastrar}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);
}