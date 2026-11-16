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

export default function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!matricula.trim() || !senha.trim()) {
      Alert.alert("Atenção", "Por favor, preencha a matrícula e a senha.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sucesso", `Bem-vindo! Matrícula: ${matricula}`);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={estilo.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={estilo.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={estilo.headerContainer}>
            <Text style={estilo.tituloLogo}>Help Campus</Text>
          </View>

          {/* Formulário de Login */}
          <View style={estilo.formContainer}>
            <TextInput
              style={estilo.input}
              placeholder="Matrícula"
              placeholderTextColor="#000000"
              value={matricula}
              onChangeText={setMatricula}
              keyboardType="numeric"
              autoCapitalize="none"
            />

            <View style={estilo.passwordContainer}>
              <TextInput
                style={[estilo.input, estilo.inputPassword]}
                placeholder="Senha"
                placeholderTextColor="#000000"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
              />
              <TouchableOpacity
                style={estilo.eyeIcon}
                onPress={() => setMostrarSenha(!mostrarSenha)}
              >
                <MaterialCommunityIcons
                  name={mostrarSenha ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#000000"
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
              style={estilo.botaoAcessar}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1E3A8A" />
              ) : (
                <Text style={estilo.textoBotaoAcessar}>Acessar</Text>
              )}
            </TouchableOpacity>

            <Text style={estilo.divisorTexto}>ou</Text>

            <TouchableOpacity
              style={estilo.linkCadastrar}
              onPress={() => router.push("/cadastro")}
            >
              <Text style={estilo.textoCadastrar}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}