import React from "react";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { store } from "./src/store";
import { LoginScreen } from "./src/screens/LoginScreen";
import { DepartmentScreen } from "./src/screens/DepartmentScreen";
import { DoctorListScreen } from "./src/screens/DoctorListScreen";
import { SlotBookingScreen } from "./src/screens/SlotBookingScreen";
import { ChatbotScreen } from "./src/screens/ChatbotScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Departments" component={DepartmentScreen} />
          <Stack.Screen name="Doctors" component={DoctorListScreen} />
          <Stack.Screen name="Slots" component={SlotBookingScreen} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
