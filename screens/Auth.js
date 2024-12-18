import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { supabase } from "../utils/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Auth = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data.user) {
        if (data.user.email_confirmed_at) {
          Alert.alert("Sucesso", "Login realizado com sucesso!");
          console.log(data.user.id);
          console.log(data.session.access_token);
        } else {
          Alert.alert("Erro", "Usuário não cadastrado.");
        }
      }

      // Salva o token manualmente
      await AsyncStorage.setItem("access_token", data.session.access_token);
      console.log("Sessão salva:", data.session.access_token);

      // Salva o userID manualmente
      await AsyncStorage.setItem("userId", data.user.id);
      console.log("userID salvo:", data.user.id);

      navigation.navigate("TransactionsForm");
    } catch (error) {
      setMessage(error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      Alert.alert(
        "Sucesso",
        "Registro realizado com sucesso. O usuário já se encontra na base do supabase."
      );
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    // variáveis localStorage
    const token = await AsyncStorage.getItem("access_token");
    const userId = await AsyncStorage.getItem("userId");

    if (!token) {
      console.log("Nenhum token encontrado. Redirecionando para login.");
      navigation.navigate("Auth");
    } else {
      console.log("Token encontrado:", token);
    }

    if (!userId) {
      console.log("Nenhum userId encontrado. Redirecionando para login.");
      navigation.navigate("Auth");
    } else {
      console.log("userId encontrado:", userId);
    }
  };

  useEffect(() => {
    checkSession(), [];
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador Financeiro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Login" onPress={handleLogin} />
          <Button title="Registrar" onPress={handleSignUp} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Auth;
