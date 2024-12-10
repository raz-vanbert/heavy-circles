import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useWorkouts } from "../hooks/useWorkouts";

export default function WorkoutsScreen() {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const router = useRouter();

  const handleAddWorkout = async () => {
    if (newWorkoutName.trim()) {
      await addWorkout(newWorkoutName.trim());
      setNewWorkoutName("");
    }
  };

  const handleDelete = async (workoutId: string) => {
    // Confirm delete
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteWorkout(workoutId);
          },
        },
      ]
    );
  };

  const handleEdit = (workoutId: string) => {
    // Implement navigation or modal to edit workout name
    Alert.alert("Edit tapped", `Edit workout: ${workoutId}`);
  };

  const renderRightActions = (workoutId: string) => (
    <View style={styles.actionsContainer}>
      <RectButton
        style={[styles.actionButton, { backgroundColor: "#4a4a4a" }]}
        onPress={() => handleEdit(workoutId)}
      >
        <Ionicons name="pencil" size={24} color="#fff" />
      </RectButton>
      <RectButton
        style={[styles.actionButton, { backgroundColor: "#ff3b30" }]}
        onPress={() => handleDelete(workoutId)}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </RectButton>
    </View>
  );

  return (
    <KeyboardAwareFlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={workouts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id)}>
          <TouchableOpacity
            onPress={() => router.push(`/workout/${item.id}`)}
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        </Swipeable>
      )}
      ListHeaderComponent={<Text style={styles.title}>Workouts</Text>}
      ListFooterComponent={
        <>
          <TextInput
            style={styles.input}
            placeholder="New workout name"
            placeholderTextColor="#aaa"
            onChangeText={setNewWorkoutName}
            value={newWorkoutName}
            returnKeyType="done"
            onSubmitEditing={handleAddWorkout}
          />
          <Button title="Add Workout" onPress={handleAddWorkout} />
        </>
      }
      extraHeight={100}
      enableOnAndroid
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#333",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
  },
  listItemText: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#444",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    width: 120,
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
