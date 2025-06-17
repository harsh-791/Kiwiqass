import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { WorkflowPlan, WorkflowStep, AppState, AppContext } from "../types";

interface AppContextType extends AppContext {
  setGoal: (goal: string) => void;
  setAppState: (state: AppState) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPlan: (plan: WorkflowPlan) => void;
  updateStep: (stepId: string, updates: Partial<WorkflowStep>) => void;
  deleteStep: (stepId: string) => void;
  reorderSteps: (fromIndex: number, toIndex: number) => void;
  addStep: (step: Omit<WorkflowStep, "id" | "order">) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateSteps: (steps: WorkflowStep[]) => void;
  editStep: (stepId: string) => void;
  reviseStep: (stepId: string) => void;
}

const AppContextInstance = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: "SET_GOAL"; payload: string }
  | { type: "SET_APP_STATE"; payload: AppState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PLAN"; payload: WorkflowPlan }
  | {
      type: "UPDATE_STEP";
      payload: { stepId: string; updates: Partial<WorkflowStep> };
    }
  | { type: "DELETE_STEP"; payload: string }
  | { type: "REORDER_STEPS"; payload: { fromIndex: number; toIndex: number } }
  | { type: "ADD_STEP"; payload: Omit<WorkflowStep, "id" | "order"> }
  | { type: "UPDATE_STEPS"; payload: WorkflowStep[] }
  | { type: "UNDO" }
  | { type: "REDO" };

const initialState: AppContext = {
  currentPlan: null,
  appState: "input",
  isLoading: false,
  error: null,
  history: [],
  historyIndex: -1,
};

function appReducer(state: AppContext, action: Action): AppContext {
  const saveToHistory = (plan: WorkflowPlan) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(plan);
    return {
      history: newHistory.slice(-20), // Keep last 20 states
      historyIndex: Math.min(newHistory.length - 1, 19),
    };
  };

  switch (action.type) {
    case "SET_GOAL":
      const newPlan: WorkflowPlan = {
        id: Date.now().toString(),
        goal: action.payload,
        steps: [],
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: newPlan,
        ...saveToHistory(newPlan),
      };

    case "SET_APP_STATE":
      return { ...state, appState: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_PLAN":
      const fixedPlan = {
        ...action.payload,
        createdAt: new Date(action.payload.createdAt),
        updatedAt: new Date(action.payload.updatedAt),
      };
      return {
        ...state,
        currentPlan: fixedPlan,
        ...saveToHistory(fixedPlan),
      };

    case "UPDATE_STEP":
      if (!state.currentPlan) return state;
      const updatedPlan = {
        ...state.currentPlan,
        steps: state.currentPlan.steps.map((step) =>
          step.id === action.payload.stepId
            ? { ...step, ...action.payload.updates }
            : step
        ),
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: updatedPlan,
        ...saveToHistory(updatedPlan),
      };

    case "DELETE_STEP":
      if (!state.currentPlan) return state;
      const planAfterDelete = {
        ...state.currentPlan,
        steps: state.currentPlan.steps
          .filter((step) => step.id !== action.payload)
          .map((step, index) => ({ ...step, order: index })),
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: planAfterDelete,
        ...saveToHistory(planAfterDelete),
      };

    case "REORDER_STEPS":
      if (!state.currentPlan) return state;
      const steps = [...state.currentPlan.steps];
      const [movedStep] = steps.splice(action.payload.fromIndex, 1);
      steps.splice(action.payload.toIndex, 0, movedStep);
      const reorderedPlan = {
        ...state.currentPlan,
        steps: steps.map((step, index) => ({ ...step, order: index })),
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: reorderedPlan,
        ...saveToHistory(reorderedPlan),
      };

    case "ADD_STEP":
      if (!state.currentPlan) return state;
      const newStep: WorkflowStep = {
        ...action.payload,
        id: Date.now().toString(),
        order: state.currentPlan.steps.length,
      };
      const planWithNewStep = {
        ...state.currentPlan,
        steps: [...state.currentPlan.steps, newStep],
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: planWithNewStep,
        ...saveToHistory(planWithNewStep),
      };

    case "UPDATE_STEPS":
      if (!state.currentPlan) return state;
      const planWithUpdatedSteps = {
        ...state.currentPlan,
        steps: action.payload,
        updatedAt: new Date(),
      };
      return {
        ...state,
        currentPlan: planWithUpdatedSteps,
        ...saveToHistory(planWithUpdatedSteps),
      };

    case "UNDO":
      if (state.historyIndex > 0) {
        return {
          ...state,
          currentPlan: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          currentPlan: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;

    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const contextValue: AppContextType = {
    ...state,
    setGoal: (goal: string) => dispatch({ type: "SET_GOAL", payload: goal }),
    setAppState: (appState: AppState) =>
      dispatch({ type: "SET_APP_STATE", payload: appState }),
    setLoading: (loading: boolean) =>
      dispatch({ type: "SET_LOADING", payload: loading }),
    setError: (error: string | null) =>
      dispatch({ type: "SET_ERROR", payload: error }),
    setPlan: (plan: WorkflowPlan) => {
      const fixedPlan = {
        ...plan,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
      };
      dispatch({ type: "SET_PLAN", payload: fixedPlan });
    },
    updateStep: (stepId: string, updates: Partial<WorkflowStep>) =>
      dispatch({ type: "UPDATE_STEP", payload: { stepId, updates } }),
    deleteStep: (stepId: string) =>
      dispatch({ type: "DELETE_STEP", payload: stepId }),
    reorderSteps: (fromIndex: number, toIndex: number) =>
      dispatch({ type: "REORDER_STEPS", payload: { fromIndex, toIndex } }),
    addStep: (step: Omit<WorkflowStep, "id" | "order">) =>
      dispatch({ type: "ADD_STEP", payload: step }),
    updateSteps: (steps: WorkflowStep[]) =>
      dispatch({ type: "UPDATE_STEPS", payload: steps }),
    editStep: (stepId: string) => {
      // This will be handled by the UI component
      console.log("Edit step:", stepId);
    },
    reviseStep: (stepId: string) => {
      // This will be handled by the UI component
      console.log("Revise step:", stepId);
    },
    undo: () => dispatch({ type: "UNDO" }),
    redo: () => dispatch({ type: "REDO" }),
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
  };

  return (
    <AppContextInstance.Provider value={contextValue}>
      {children}
    </AppContextInstance.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContextInstance);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
