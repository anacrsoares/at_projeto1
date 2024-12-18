import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

const TransacaoItemList = ({ transacao }) => {
  // Estado para armazenar a orientação
  const [isLandscape, setIsLandscape] = useState(false);

  // Detecta mudanças na orientação do dispositivo
  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");
      setIsLandscape(width > height);
    };

    // Adiciona listener de mudança de dimensão
    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    // Define a orientação inicial
    handleOrientationChange();

    return () => subscription?.remove();
  }, []);

  const { descricao, valor, data, hora, categoria, tipo, moeda } = transacao;

  // Configurar dados para o FlatList
  const baseData = [
    { key: "Descrição", value: descricao },
    { key: "Valor", value: `R$ ${valor.toFixed(2)}` },
    { key: "Data", value: data },
  ];

  const additionalData = [
    { key: "Hora", value: hora },
    { key: "Categoria", value: categoria },
    { key: "Tipo", value: tipo },
    { key: "Moeda", value: moeda },
  ];

  // Combinar dados com base na orientação
  const listData = isLandscape ? [...baseData, ...additionalData] : baseData;

  return (
    <View style={styles.container}>
      {/* Dados sempre visíveis */}
      <View style={styles.row}>
        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{descricao}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Valor:</Text>
        <Text style={styles.value}>R$ {valor.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Data:</Text>
        <Text style={styles.value}>{data}</Text>
      </View>

      {/* Dados adicionais no modo paisagem */}
      {isLandscape && (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Hora:</Text>
            <Text style={styles.value}>{hora}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Categoria:</Text>
            <Text style={styles.value}>{categoria}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={styles.value}>{tipo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Moeda:</Text>
            <Text style={styles.value}>{moeda}</Text>
          </View>
        </>
      )}
    </View>
  );
};

export default TransacaoItemList;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    // justifyContent: "center",
  },
  container: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 2, // sombra no Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    backgroundColor: "#fff",
  },
  receita: {
    borderLeftWidth: 5,
    borderLeftColor: "green", // Destaque para receita
  },
  despesa: {
    borderLeftWidth: 5,
    borderLeftColor: "red", // Destaque para despesa
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  descricao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  valor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  data: {
    fontSize: 12,
    color: "#777",
  },
  detail: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
});
