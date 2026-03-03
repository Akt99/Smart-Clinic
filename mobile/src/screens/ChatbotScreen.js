import React from "react";
import { Button, SafeAreaView, Text } from "react-native";

export function ChatbotScreen() {
  return (
    <SafeAreaView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Department Chatbot</Text>
      <Button title="Send Message" onPress={() => {}} />
    </SafeAreaView>
  );
}
