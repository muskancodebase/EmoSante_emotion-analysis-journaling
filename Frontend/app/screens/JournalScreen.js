import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { analyzeEmotion } from "../../api";  // 👈 goes up 2 levels since api.js is outside /app

export default function JournalScreen() {
  const [entry, setEntry] = useState("");
  const [emotion, setEmotion] = useState("");

  const handleAnalyze = async () => {
    const detected = await analyzeEmotion(entry);
    setEmotion(detected);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Write your journal entry:</Text>
      <TextInput
        value={entry}
        onChangeText={setEntry}
        placeholder="Type your thoughts..."
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginVertical: 10,
        }}
      />
      <Button title="Analyze Emotion" onPress={handleAnalyze} />
      {emotion ? (
        <Text style={{ marginTop: 20, fontSize: 20 }}>
          Detected Emotion: {emotion}
        </Text>
      ) : null}
    </View>
  );
}
