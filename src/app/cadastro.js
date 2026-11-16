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
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { estilosEscuros } from "@/styles/styles";
import { useTheme } from "@/context/ThemeContext";

export default function Cadastro() {
  const { modoEscuro } = useTheme();
  const tema = modoEscuro ? estilosEscuros : /** @type {typeof estilosEscuros} */ ({});
  const [tipoUsuario, setTipoUsuario] = useState("aluno");
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  /** @type {{ value: string, label: string, icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'] }[]} */
  const opcoesPerfil = [
    { label: "Aluno", value: "aluno", icon: "school-outline" },
    { label: "Professor", value: "professor", icon: "human-male-board" },
    {
      label: "Funcionário",
      value: "funcionario",
      icon: "badge-account-outline",
    },
  ];

  const handleCadastro = async () => {
  const matriculaLimpa = matricula.trim();
  const nomeLimpo = nome.trim();
  const emailLimpo = email.trim().toLowerCase();

  if (!nomeLimpo || !matriculaLimpa || !emailLimpo || !senha || !confirmarSenha) {
    Alert.alert("Atenção", "Preencha todos os campos.");
    return;
  }

  if (!/^\d{7,9}$/.test(matriculaLimpa)) {
    Alert.alert("Erro", "A matrícula deve conter entre 7 e 9 números.");
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(emailLimpo)) {
    Alert.alert("Erro", "Informe um e-mail válido.");
    return;
  }

  if (!/^\d{6,}$/.test(senha)) {
    Alert.alert("Erro", "A senha deve conter pelo menos 6 números.");
    return;
  }

  if (senha !== confirmarSenha) {
    Alert.alert("Erro", "As senhas não coincidem.");
    return;
  }

  setLoading(true);

  try {
    const emailAutenticacao = `${matriculaLimpa}@helpcampus.demo`;

    const resultado = await createUserWithEmailAndPassword(
      auth,
      emailAutenticacao,
      senha
    );

    await updateProfile(resultado.user, { displayName: nomeLimpo });

    await setDoc(doc(db, "usuarios", resultado.user.uid), {
      nome: nomeLimpo,
      matricula: matriculaLimpa,
      email: emailLimpo,
      perfil: tipoUsuario,
      curso: ""
    });

    await signOut(auth);

    Alert.alert("Sucesso", "Conta criada com sucesso! Entre com sua matrícula e senha.");
    router.replace("/login");

  } catch (erro) {
    console.error("ERRO CADASTRO:", erro);
    Alert.alert("Erro no cadastro", erro instanceof Error ? `${"code" in erro ? String(erro.code) : "Erro"}: ${erro.message}` : String(erro));
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
            <Text style={[estilo.tituloLogo, tema.tituloLogo]}>Help Campus</Text>
            <Text style={[estilo.subtitulo, tema.subtitulo]}>Criar conta</Text>
          </View>

          {/* Formulário de Cadastro */}
          <View style={estilo.formContainer}>
            {/* Seletor de Perfil */}
            <View style={[estilo.seletorWrapper, tema.seletorWrapper]}>
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
                      color={ativo ? "#FFFFFF" : modoEscuro ? "#BFDBFE" : "#1E3A8A"}
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
              style={[estilo.input, tema.input]}
              placeholder="Nome Completo"
              placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <TextInput
              style={[estilo.input, tema.input]}
              placeholder="Matrícula"
              placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
              value={matricula}
              onChangeText={setMatricula}
              keyboardType="numeric"
              autoCapitalize="none"
            />

            <TextInput
              style={[estilo.input, tema.input]}
              placeholder="E-mail Institucional"
              placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
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

            <View style={estilo.passwordContainer}>
              <TextInput
                style={[estilo.input, estilo.inputPassword, tema.input]}
                placeholder="Confirmar senha"
                placeholderTextColor={modoEscuro ? "#94A3B8" : "#000000"}
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
                  color={modoEscuro ? "#FFFFFF" : "#000000"}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[estilo.botaoAcessar, tema.botaoAcessar]}
              onPress={handleCadastro}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1E3A8A" />
              ) : (
                <Text style={[estilo.textoBotaoAcessar, tema.textoBotaoAcessar]}>Cadastrar</Text>
              )}
            </TouchableOpacity>

            <View style={estilo.footerContainer}>
              <Text style={[estilo.divisorTexto, tema.divisorTexto]}>Já possui conta? </Text>
              <TouchableOpacity
                style={estilo.linkCadastrar}
                onPress={() => router.back()}
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