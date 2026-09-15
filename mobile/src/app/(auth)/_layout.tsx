import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Redirect, Tabs } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../utils/authContext";

export default function AuthLayout() {
  const auth = useContext(AuthContext);

  if (auth.isReding) {
    return;
  }

  if (!auth.isLoggedIn) {
    return <Redirect href={"/login"} />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
          tabBarActiveTintColor: "#286b43",
          tabBarInactiveTintColor: "#91a095",
          tabBarStyle: { backgroundColor: "#ffffff", borderTopColor: "#e5ebe2" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: () => (
            <MaterialIcons name="home" size={24} color={"#286b43"} />
          ),
        }}
      />
      <Tabs.Screen name="listaClientes" options={{ title: "Mapa", tabBarIcon: ({ color }) => <MaterialIcons name="map" size={24} color={color} /> }} />
      <Tabs.Screen name="perfil" options={{ title: "Carteira", tabBarIcon: ({ color }) => <MaterialIcons name="account-balance-wallet" size={24} color={color} /> }} />
    </Tabs>
  );
}