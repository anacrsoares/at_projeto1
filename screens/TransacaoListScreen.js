import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import TransacaoItemList from "../components/TransacaoItemList";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";

const TransacaoListScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user?.id) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("transacoes")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao carregar transações.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Transações</Text>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransacaoItemList transacao={item} />}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhuma transação disponível</Text>
        }
      />
    </SafeAreaView>
  );
};

export default TransacaoListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  emptyText: { textAlign: "center", fontSize: 16, color: "#777" },
});
