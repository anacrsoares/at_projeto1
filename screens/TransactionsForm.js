import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GetCurrencyInfo from "../api/GetCurrencyInfo";
import { supabase } from "../supabaseClient";

const TransactionsForm = () => {
  const navigation = useNavigation();

  // Hook para pegar moedas
  const { currencyInfo, isLoading, message } = GetCurrencyInfo();
  const [showOptions, setShowOptions] = useState(false);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tipo, setTipo] = useState("");
  const [moeda, setMoeda] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Função para salvar os dados no estado e no
  const handleSubmit = async () => {
    // Remover espaços extras antes da validação
    const trimmedDescricao = descricao.trim();
    const trimmedValor = valor.trim();
    const trimmedData = data.trim();
    const trimmedHora = hora.trim();
    const trimmedCategoria = categoria.trim();
    const trimmedTipo = tipo.trim();
    const trimmedMoeda = moeda.trim();

    // Validação
    if (
      !trimmedDescricao ||
      !trimmedValor ||
      !trimmedData ||
      !trimmedHora ||
      !trimmedCategoria ||
      !trimmedTipo ||
      !trimmedMoeda
    ) {
      console.log("Erro", "Preencha todos os campos!");
      return;
    }

    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      console.log("Erro", "Usuário não autenticado.");
      return;
    }

    const userId = data.user.id; // ID do usuário autenticado
    console.log("Usuário autenticado:", userId);

    try {
      // Atualiza a variável de estado
      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);

      const newTransaction = {
        user_id: userId,
        descricao: trimmedDescricao,
        valor: parseFloat(trimmedValor),
        data: trimmedData,
        hora: trimmedHora,
        categoria: trimmedCategoria,
        tipo: trimmedTipo,
        moeda: trimmedMoeda,
      };

      console.log("Transação:", newTransaction);

      // Salva no Supabase
      const { error } = await supabase
        .from("client_transacoes")
        .insert([newTransaction]);

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        return;
      }

      // Navega para a lista e envia os dados
      // navigation.navigate("TransacaoListScreen");

      // Limpa o formulário
      setDescricao("");
      setValor("");
      setData("");
      setHora("");
      setCategoria("");
      setTipo("");
      setMoeda("");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar a transação.");
    }
  };

  return (
    <FlatList
      data={[]}
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>Nova Transação</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Data (dd/mm/aaaa)"
            value={data}
            onChangeText={setData}
          />
          <TextInput
            style={styles.input}
            placeholder="Hora (hh:mm)"
            value={hora}
            onChangeText={setHora}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria (ex.: alimentação, saúde)"
            value={categoria}
            onChangeText={setCategoria}
          />

          <TextInput
            style={styles.input}
            placeholder="Tipo (ex.: receita, despesa)"
            value={tipo}
            onChangeText={setTipo}
          />

          {/*Escolha da moeda*/}

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowOptions((prev) => !prev)}
          >
            <Text>
              {moeda || (
                <Text style={styles.placeholderColor}>Escolha uma moeda</Text>
              )}
            </Text>
          </TouchableOpacity>

          {showOptions && (
            <View style={styles.optionsContainer}>
              {isLoading ? (
                <Text style={styles.loadingText}>Carregando moedas...</Text>
              ) : (
                <FlatList
                  data={currencyInfo}
                  keyExtractor={(item) => item.simbolo}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        setMoeda(item.nomeFormatado);
                        setShowOptions(false);
                      }}
                    >
                      <Text>{item.nomeFormatado}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Salvar Transação</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate("TransacaoListScreen")}
            >
              <Text style={styles.buttonText}>Ver Transações</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
      keyExtractor={() => "dummy-key"}
    />
  );
};

export default TransactionsForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
    color: "#aaa",
    marginBottom: 10,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  loadingText: { textAlign: "center", padding: 10 },

  error: { color: "red", textAlign: "center", marginTop: 10 },

  buttons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    justifyContent: "space-between",
  },

  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  viewButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },

  placeholderColor: {
    color: "#aaa",
  },
});
