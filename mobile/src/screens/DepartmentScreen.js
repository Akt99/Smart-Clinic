import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

export function DepartmentScreen({ navigation }) {
  return (
    <SafeAreaView style={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Select Department</Text>
      <Button title="Psychiatry" onPress={() => navigation.navigate("Doctors", { departmentId: "psy" })} />
      <Button title="Gynaecology" onPress={() => navigation.navigate("Doctors", { departmentId: "gyn" })} />
      <Button title="Orthopaedics" onPress={() => navigation.navigate("Doctors", { departmentId: "ortho" })} />
      <Button title="Open Chatbot" onPress={() => navigation.navigate("Chatbot")} />
    </SafeAreaView>
  );
}
