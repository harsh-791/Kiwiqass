import { WorkflowStep, WorkflowPlan } from "../types";

const API_BASE_URL = "http://localhost:3001/api";

export async function generateWorkflowPlan(
  goal: string
): Promise<WorkflowPlan> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-workflow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate workflow plan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating workflow plan:", error);
    throw new Error("Failed to generate workflow plan. Please try again.");
  }
}

export async function reviseStep(
  stepId: string,
  instruction: string
): Promise<Omit<WorkflowStep, "id" | "order">> {
  try {
    const response = await fetch(`${API_BASE_URL}/revise-step`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stepId, instruction }),
    });

    if (!response.ok) {
      throw new Error("Failed to revise step");
    }

    return await response.json();
  } catch (error) {
    console.error("Error revising step:", error);
    throw new Error("Failed to revise step. Please try again.");
  }
}
