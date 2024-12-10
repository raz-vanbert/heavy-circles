import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useWorkouts } from "../../hooks/useWorkouts";

export default function WorkoutScreen() {
  const { id: workoutId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { workouts, addExerciseToWorkout } = useWorkouts();

  const [newExerciseName, setNewExerciseName] = useState("");

  const workout = workouts.find((w) => w.id === workoutId);

  const handleAddExercise = async () => {
    if (workoutId && newExerciseName.trim()) {
      await addExerciseToWorkout(workoutId, newExerciseName.trim());
      setNewExerciseName("");
    }
  };

  if (!workout) {
    return <Text style={styles.title}>Workout not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <KeyboardAwareFlatList
        contentContainerStyle={styles.content}
        data={workout.exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push(`/workout/${workoutId}/exercise/${item.id}`)
            }
            style={styles.listItem}
          >
            <Text style={styles.listItemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <>
            <TextInput
              style={styles.input}
              placeholder="New exercise name"
              placeholderTextColor="#aaa"
              onChangeText={setNewExerciseName}
              value={newExerciseName}
              onSubmitEditing={handleAddExercise}
              returnKeyType="done"
            />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    padding: 20,
  },
  content: { padding: 0 },
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
});
