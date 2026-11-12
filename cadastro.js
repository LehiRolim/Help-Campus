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
  Image as RNImage,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import estilo from "./styles";

export default function Cadastro({ navigation }) {
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const opcoesPerfil = [
    { label: "Aluno", value: "aluno", icon: "school-outline" },
    { label: "Professor", value: "professor", icon: "human-male-board" },
    {
      label: "Funcionário",
      value: "funcionario",
      icon: "badge-account-outline",
    },
  ];

  const handleCadastro = () => {
    if (
      !nome.trim() ||
      !matricula.trim() ||
      !email.trim() ||
      !senha.trim() ||
      !confirmarSenha.trim()
    ) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      Alert.alert("Sucesso", `Conta de ${tipoUsuario} criada com sucesso!`, [
        { text: "Ir para Login", onPress: () => navigation.navigate("login") },
      ]);
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
          {/* Logo Brasão UNIFOR vindo direto do assets */}
          <View style={estilo.headerContainer}>
            <RNImage
              source={require("./assets/Brasao_unifor.png")}
              style={estilo.logo}
            />
            <Text style={estilo.tituloLogo}>Help Campus</Text>
            <Text style={estilo.subtitulo}>Criar conta</Text>
          </View>

          {/* Formulário de Cadastro */}
          <View style={estilo.formContainer}>
            {/* Seletor de Perfil */}
            <View style={estilo.seletorWrapper}>
              {opcoesPerfil.map((opcao) => {
                const ativo = tipoUsuario === opcao.value;
                return (
                  <TouchableOpacity
                    key={opcao.value}
                    style={[estilo.opcaoBotao, ativo && estilo.opcaoBotaoAtivo]}
                    onPress={() => setTipoUsuario(opcao.value)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name={opcao.icon}
                      size={18}
                      color={ativo ? "#FFFFFF" : "#1E3A8A"}
                      style={{ marginBottom: 2 }}
                    />
                    <Text
                      style={[
                        estilo.opcaoTexto,
                        ativo && estilo.opcaoTextoAtivo,
                      ]}
                    >
                      {opcao.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              style={estilo.input}
              placeholder="Nome Completo"
              placeholderTextColor="#000000"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <TextInput
              style={estilo.input}
              placeholder="Matrícula"
              placeholderTextColor="#000000"
              value={matricula}
              onChangeText={setMatricula}
              keyboardType="numeric"
              autoCapitalize="none"
            />

            <TextInput
              style={estilo.input}
              placeholder="E-mail Institucional"
              placeholderTextColor="#000000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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

            <View style={estilo.passwordContainer}>
              <TextInput
                style={[estilo.input, estilo.inputPassword]}
                placeholder="Confirmar senha"
                placeholderTextColor="#000000"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={!mostrarConfirmarSenha}
              />
              <TouchableOpacity
                style={estilo.eyeIcon}
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              >
                <MaterialCommunityIcons
                  name={
                    mostrarConfirmarSenha ? "eye-outline" : "eye-off-outline"
                  }
                  size={22}
                  color="#000000"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={estilo.botaoAcessar}
              onPress={handleCadastro}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1E3A8A" />
              ) : (
                <Text style={estilo.textoBotaoAcessar}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View style={estilo.footerContainer}>
              <Text style={estilo.divisorTexto}>Já possui conta? </Text>
              <TouchableOpacity
                style={estilo.linkCadastrar}
                onPress={() => navigation.navigate("login")}
              >
                <Text style={estilo.textoCadastrar}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}