import OpenAI from "openai";
import { WorkflowStep, WorkflowPlan } from "../types";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, you should proxy these requests through your backend
});

const SYSTEM_PROMPT = `You are an AI assistant that helps users break down their goals into actionable workflow steps.
For each step, provide:
1. A clear, concise title
2. A detailed description of what needs to be done
3. The most appropriate tool to use
4. Your reasoning for why this step is necessary
5. Your confidence level in this suggestion (0-1)

Format your response as a JSON object with the following structure:
{
  "steps": [
    {
      "title": "string",
      "description": "string",
      "toolName": "string",
      "reasoning": "string",
      "confidence": number
    }
  ],
  "overallConfidence": number,
  "reasoning": "string"
}`;

export async function generateWorkflowPlan(
  goal: string
): Promise<WorkflowPlan> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Please break down this goal into actionable steps: ${goal}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      id: Date.now().toString(),
      goal,
      steps: response.steps.map((step: any, index: number) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        order: index,
        aiAgent: "GPT-4",
      })),
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
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
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Please revise this step based on the following instruction: ${instruction}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const response = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      ...response.steps[0],
      aiAgent: "GPT-4",
    };
  } catch (error) {
    console.error("Error revising step:", error);
    throw new Error("Failed to revise step. Please try again.");
  }
}
