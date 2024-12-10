import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Set } from "../types/workouts";

interface SetRowProps {
  setItem: Set;
  onWeightChange: (weight: string) => void;
  onRepsChange: (reps: string) => void;
}

export default function SetRow({
  setItem,
  onWeightChange,
  onRepsChange,
}: SetRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Set {setItem.number}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(setItem.weight)}
        onChangeText={onWeightChange}
        placeholder="Weight"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(setItem.reps)}
        onChangeText={onRepsChange}
        placeholder="Reps"
        placeholderTextColor="#aaa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    color: "#fff",
    marginRight: 10,
  },
  input: {
    backgroundColor: "#444",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    width: 60,
    textAlign: "center",
  },
});
