import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

import { API_BASE_URL } from '../config';

export default function ResetPasswordScreen() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const res = await fetch(`${API_BASE_URL}/reset/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Reset Password</Text>

      <TextInput
        placeholder="Paste Token"
        value={token}
        onChangeText={setToken}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginTop: 20,
        }}
      />

      <TextInput
        placeholder="New password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          padding: 10,
          borderRadius: 6,
          marginTop: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleReset}
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white" }}>Update Password</Text>
      </TouchableOpacity>

      {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
    </View>
  );
}
