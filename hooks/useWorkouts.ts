import { useContext } from "react";
import { WorkoutsContext } from "../context/WorkoutsContext";

export function useWorkouts() {
  return useContext(WorkoutsContext);
}
