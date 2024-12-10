import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid/non-secure";
import React, { createContext, useEffect, useState } from "react";
import { Session, Workout } from "../types/workouts";

type WorkoutsContextValue = {
  workouts: Workout[];
  addWorkout: (name: string) => Promise<void>;
  updateWorkout: (updatedWorkout: Workout) => Promise<void>;
  addExerciseToWorkout: (
    workoutId: string,
    exerciseName: string
  ) => Promise<void>;
  addSetToExercise: (workoutId: string, exerciseId: string) => Promise<void>;
  removeSetFromExercise: (
    workoutId: string,
    exerciseId: string,
    setNumber: number
  ) => Promise<void>;
  updateExercise: (workoutId: string, exercise: any) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  sessions: Session[];
  startSession: (workoutId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
};

export const WorkoutsContext = createContext<WorkoutsContextValue>({
  workouts: [],
  addWorkout: async () => {},
  updateWorkout: async () => {},
  addExerciseToWorkout: async () => {},
  addSetToExercise: async () => {},
  removeSetFromExercise: async () => {},
  updateExercise: async () => {},
  deleteWorkout: async () => {},
  sessions: [],
  startSession: async () => {},
  endSession: async () => {},
});

export const WorkoutsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    (async () => {
      const storedWorkouts = await AsyncStorage.getItem("workouts");
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      const storedSessions = await AsyncStorage.getItem("sessions");
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    })();
  }, []);

  const persistWorkouts = async (updated: Workout[]) => {
    setWorkouts(updated);
    await AsyncStorage.setItem("workouts", JSON.stringify(updated));
  };

  const persistSessions = async (updated: Session[]) => {
    setSessions(updated);
    await AsyncStorage.setItem("sessions", JSON.stringify(updated));
  };

  const addWorkout = async (name: string) => {
    const newWorkout: Workout = {
      id: nanoid(),
      name,
      exercises: [],
    };
    await persistWorkouts([...workouts, newWorkout]);
  };

  const updateWorkout = async (updatedWorkout: Workout) => {
    const newWorkouts = workouts.map((w) =>
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    await persistWorkouts(newWorkouts);
  };

  const addExerciseToWorkout = async (
    workoutId: string,
    exerciseName: string
  ) => {
    const w = workouts.find((x) => x.id === workoutId);
    if (!w) return;
    const newExercise = {
      id: nanoid(),
      name: exerciseName,
      sets: [],
    };
    w.exercises.push(newExercise);
    await updateWorkout(w);
  };

  const addSetToExercise = async (workoutId: string, exerciseId: string) => {
    const w = workouts.find((x) => x.id === workoutId);
    if (!w) return;
    const e = w.exercises.find((x) => x.id === exerciseId);
    if (!e) return;
    const set = {
      number: e.sets.length + 1,
      weight: 0,
      reps: 0,
    };
    e.sets.push(set);
    await updateWorkout(w);
  };

  const updateExercise = async (workoutId: string, exercise: any) => {
    const w = workouts.find((x) => x.id === workoutId);
    if (!w) return;
    const updatedExercises = w.exercises.map((e) =>
      e.id === exercise.id ? exercise : e
    );
    w.exercises = updatedExercises;
    await updateWorkout(w);
  };

  const removeSetFromExercise = async (
    workoutId: string,
    exerciseId: string,
    setNumber: number
  ) => {
    const w = workouts.find((x) => x.id === workoutId);
    if (!w) return;

    const exercise = w.exercises.find((e) => e.id === exerciseId);
    if (!exercise) return;

    exercise.sets = exercise.sets.filter((s) => s.number !== setNumber);

    // re-index the set numbers
    exercise.sets = exercise.sets.map((s, i) => ({ ...s, number: i + 1 }));

    await updateExercise(workoutId, exercise);
  };

  const deleteWorkout = async (workoutId: string) => {
    const newWorkouts = workouts.filter((w) => w.id !== workoutId);
    await persistWorkouts(newWorkouts);
  };

  const startSession = async (workoutId: string) => {
    const newSession: Session = {
      id: nanoid(),
      startTime: Date.now(),
      endTime: 0,
      workoutId,
      exercises: [],
      notes: "",
    };
    await persistSessions([...sessions, newSession]);
  };

  const endSession = async (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;
    session.endTime = Date.now();
    await persistSessions(sessions);
  };

  return (
    <WorkoutsContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        addExerciseToWorkout,
        addSetToExercise,
        removeSetFromExercise,
        updateExercise,
        deleteWorkout,
        sessions,
        startSession,
        endSession,
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  );
};
