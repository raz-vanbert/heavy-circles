import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import SetRow from "../../../../components/SetRow";
import { useWorkouts } from "../../../../hooks/useWorkouts";
import { Set } from "../../../../types/workouts";

export default function ExercisesScreen() {
  const { id: workoutId, exerciseId } = useLocalSearchParams<{
    id: string;
    exerciseId: string;
  }>();
  const { workouts, updateExercise, addSetToExercise, removeSetFromExercise } =
    useWorkouts();
  const router = useRouter();

  const workout = workouts.find((w) => w.id === workoutId);
  const exercise = workout?.exercises.find((e) => e.id === exerciseId);

  if (!workout || !exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Exercise not found</Text>
      </View>
    );
  }

  const handleSetChange = async (
    index: number,
    field: keyof Set,
    value: string
  ) => {
    const setsCopy = [...exercise.sets];
    const numericValue = Number(value);
    setsCopy[index] = {
      ...setsCopy[index],
      [field]: isNaN(numericValue) ? value : numericValue,
    };
    const updatedExercise = { ...exercise, sets: setsCopy };
    await updateExercise(workoutId, updatedExercise);
  };

  const handleAddSet = async () => {
    await addSetToExercise(workoutId, exerciseId);
  };

  const handleDelete = async (setNumber: number) => {
    // Confirm delete
    Alert.alert("Delete Set", "Are you sure you want to delete this set?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeSetFromExercise(workoutId, exerciseId, setNumber);
        },
      },
    ]);
  };

  const currentIndex = workout.exercises.findIndex((e) => e.id === exerciseId);
  const nextExercise = workout.exercises[currentIndex + 1];

  const renderRightActions = (setNumber: number) => (
    <View style={styles.actionsContainer}>
      <RectButton
        style={[styles.actionButton, { backgroundColor: "#ff3b30" }]}
        onPress={() => handleDelete(setNumber)}
      >
        <Ionicons name="trash" size={24} color="#fff" />
      </RectButton>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      <KeyboardAwareFlatList
        data={exercise.sets}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item, index }) => (
          <Swipeable renderRightActions={() => renderRightActions(item.number)}>
            <SetRow
              setItem={item}
              onWeightChange={(val) => handleSetChange(index, "weight", val)}
              onRepsChange={(val) => handleSetChange(index, "reps", val)}
            />
          </Swipeable>
        )}
        ListFooterComponent={
          <View style={{ marginTop: 20 }}>
            <Button title="Add Set" onPress={handleAddSet} />
            {nextExercise && (
              <View style={{ marginVertical: 10 }}>
                <Button
                  title="Next Exercise"
                  onPress={() =>
                    router.replace(
                      `/workout/${workoutId}/exercise/${nextExercise.id}`
                    )
                  }
                />
              </View>
            )}
          </View>
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
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    width: 60,
    justifyContent: "flex-end",
  },
  actionButton: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
