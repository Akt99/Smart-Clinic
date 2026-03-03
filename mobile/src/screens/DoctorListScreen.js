import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

export function DoctorListScreen({ navigation }) {
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Doctors</Text>
      <Button title="Book Dr. Sam Michael" onPress={() => navigation.navigate("Slots")} />
    </SafeAreaView>
  );
}
