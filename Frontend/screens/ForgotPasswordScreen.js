import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { API_BASE_URL } from '../config';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async () => {
    const res = await fetch(`${API_BASE_URL}/reset/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Forgot Password</Text>

      <TextInput
        placeholder="Your email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginTop: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleRequest}
        style={{
          backgroundColor: "blue",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>Send Reset Token</Text>
      </TouchableOpacity>

      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}
