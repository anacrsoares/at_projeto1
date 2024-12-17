import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
// import { ScrollView } from "react-native-gesture-handler";

const TransacaoItemList = ({ transacao }) => {
  // Estado para armazenar a orientação
  const [isLandscape, setIsLandscape] = useState(false);

  // Detecta mudanças na orientação do dispositivo
  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");
      setIsLandscape(width > height); // Paisagem se largura > altura
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

  return (
    <ScrollView style={styles.scrollContainer}>
      <Text style={styles.descricao}>{descricao}</Text>
      <Text style={styles.valor}>
        {moeda} {valor}
      </Text>
      <Text style={styles.detail}>Hora: {hora}</Text>
      <Text style={styles.detail}>Categoria: {categoria}</Text>
      <Text style={styles.detail}>
        Tipo: {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
      </Text>
    </ScrollView>
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
