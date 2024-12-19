import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import GetCurrencyInfo from "../api/GetCurrencyInfo";
import GetDailyCurrencyQuote from "../api/GetDailyCurrencyQuote";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const TransactionsForm = () => {
  const navigation = useNavigation();

  // Variáveis localStorage
  const token = AsyncStorage.getItem("access_token");
  const userId = AsyncStorage.getItem("userId");

  // Meu hook para pegar moedas
  const { currencyInfo, isLoading } = GetCurrencyInfo();
  const [showOptions, setShowOptions] = useState(false);

  const [descricao, setDescricao] = useState("a");
  const [valor, setValor] = useState("22");
  const [data, setData] = useState(new Date());
  const [hora, setHora] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [categoria, setCategoria] = useState("saúde");
  const [tipo, setTipo] = useState("despesa");
  const [moeda, setMoeda] = useState("");
  const [moedaCotacao, setMoedaCotacao] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Funções para abrir componentes de data e hora
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setData(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setHora(selectedTime);
    }
  };

  // Função para salvar os dados no Local Storage
  const handleSubmit = async () => {
    const trimmedDescricao = descricao.trim();
    const trimmedValor = valor.trim();
    const trimmedCategoria = categoria.trim();
    const trimmedTipo = tipo.trim();
    const trimmedMoeda = moeda.trim();

    // Validação
    if (
      !trimmedDescricao ||
      !trimmedValor ||
      !data ||
      !hora ||
      !trimmedCategoria ||
      !trimmedTipo ||
      !trimmedMoeda
    ) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    const formatDataCotacao = (date) => {
      const isoDate = date.toISOString().split("T")[0]; // Retorna YYYY-MM-DD
      const [year, month, day] = isoDate.split("-"); // Separa os componentes da data
      return `${month}-${day}-${year}`; // Retorna no formato MM-DD-YYYY
    };

    const newTransaction = {
      user_id: userId,
      descricao: trimmedDescricao,
      valor: parseFloat(trimmedValor),
      data: data.toLocaleDateString("pt-BR"),
      hora: hora.toLocaleTimeString("pt-BR"),
      categoria: trimmedCategoria,
      tipo: trimmedTipo,
      moeda: trimmedMoeda,
      moedaCotacao: moedaCotacao,
      dataCotacao: formatDataCotacao(data),
    };

    console.log("Moeda: ", newTransaction.moedaCotacao);
    console.log("Data: ", newTransaction.dataCotacao);

    console.log("Nova transação criada:", newTransaction);

    // Atualiza a variável de estado
    const updatedTransactions = [...transactions, newTransaction];

    setTransactions(updatedTransactions);

    console.log(
      "Transação Completa>>>>>>",
      JSON.stringify(updatedTransactions, null, 2)
    );

    // Cria o objeto de sessão
    const sessionData = {
      token,
      userId,
      transactions: updatedTransactions,
    };

    // Limpa o formulário
    setDescricao("");
    setValor("");
    setData(new Date());
    setHora(new Date());
    setCategoria("");
    setTipo("");
    setMoeda("");

    // Navega para a lista e envia os dados
    navigation.navigate("TransacaoListScreen", {
      sessionData: { transactions: updatedTransactions },
    });
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
            placeholder="Valor na moeda local"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
          />
          {/* Campo de data */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{data.toLocaleDateString("pt-BR")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          {/* Campo de hora */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{hora.toLocaleTimeString("pt-BR")}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={hora}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
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
                        setMoedaCotacao(item.simbolo);
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
              onPress={() =>
                navigation.navigate("TransacaoListScreen", {
                  sessionData: { transactions },
                })
              }
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
