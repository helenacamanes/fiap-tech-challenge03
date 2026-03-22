import React, { createContext, useContext, useState } from "react";
import { notifyGoalReached } from "../services/notificationService";

export type Goal = {
  id: string;
  title: string;
  current: number;
  target: number;
  icon: string;
  color: string;
};

type GoalsContextData = {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id">) => void;
  addValueToGoal: (goalId: string, amount: number) => void;
  removeGoal: (goalId: string) => void;
};

const GoalsContext = createContext<GoalsContextData>({} as GoalsContextData);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Reserva de emergência",
      current: 4200,
      target: 10000,
      icon: "shield-checkmark-outline",
      color: "#3B82F6",
    },
    {
      id: "2",
      title: "Viagem para Europa",
      current: 1850,
      target: 15000,
      icon: "airplane-outline",
      color: "#F59E0B",
    },
    {
      id: "3",
      title: "Entrada do apartamento",
      current: 8500,
      target: 30000,
      icon: "home-outline",
      color: "#10B981",
    },
  ]);

  function addGoal(goal: Omit<Goal, "id">) {
    setGoals((prev) => [
      ...prev,
      { ...goal, id: Date.now().toString() },
    ]);
  }

  function addValueToGoal(goalId: string, amount: number) {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const newCurrent = Math.min(g.current + amount, g.target);
        if (newCurrent >= g.target) {
          notifyGoalReached(g.title);
        }
        return { ...g, current: newCurrent };
      })
    );
  }

  function removeGoal(goalId: string) {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  }

  return (
    <GoalsContext.Provider value={{ goals, addGoal, addValueToGoal, removeGoal }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  return useContext(GoalsContext);
}