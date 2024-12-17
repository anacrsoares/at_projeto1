import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// import Screens
import TransacaoListScreen from "./screens/TransacaoListScreen";
import Auth from "./screens/Auth";
import TransactionsForm from "./screens/TransactionsForm";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          component={Auth}
          name={"Auth"}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={TransactionsForm}
          name={"TransactionsForm"}
          options={{ title: "Formulário de Transações Feitas" }}
        />
        <Stack.Screen
          component={TransacaoListScreen}
          name={"TransacaoListScreen"}
          options={{ title: "Minhas Transações" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});
