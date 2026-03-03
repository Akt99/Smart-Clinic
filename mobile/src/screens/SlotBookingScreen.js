import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

export function SlotBookingScreen() {
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Book 30-minute slot</Text>
      <Button title="Confirm Slot" onPress={() => {}} />
    </SafeAreaView>
  );
}
