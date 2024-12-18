import React from "react";
import { StyleSheet, Text, Dimensions, View, FlatList } from "react-native";
import TransacaoItemList from "../components/TransacaoItemList";

const TransactionsListScreen = ({ route }) => {
  // Obter os dados de transação passados via navegação
  const { sessionData } = route.params || [];
  const transactions = sessionData?.transactions || [];

  console.log(sessionData);
  console.log("Transações recebidas:", transactions);

  return (
    <FlatList
      data={transactions}
      renderItem={({ item }) => <TransacaoItemList transacao={item} />}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Nenhuma transação disponível</Text>
      }
    />
  );
};

export default TransactionsListScreen;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#333",
  },
});
