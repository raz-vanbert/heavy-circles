export interface Set {
  number: number;
  weight: number;
  reps: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  workoutId: string;
  exercises: Exercise[];
  notes: string;
}
