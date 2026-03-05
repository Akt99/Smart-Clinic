import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

export function LoginScreen({ navigation }) {
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Login (Phone + OTP)</Text>
      <Button title="Continue" onPress={() => navigation.navigate("Departments")} />
    </SafeAreaView>
  );
}
