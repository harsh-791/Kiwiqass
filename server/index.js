const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

// Generate workflow plan
app.post("/api/generate-workflow", async (req, res) => {
  try {
    const { goal } = req.body;

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

    const workflowPlan = {
      id: Date.now().toString(),
      goal,
      steps: response.steps.map((step, index) => ({
        ...step,
        id: `step-${Date.now()}-${index}`,
        order: index,
        aiAgent: "GPT-4",
      })),
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    res.json(workflowPlan);
  } catch (error) {
    console.error("Error generating workflow plan:", error);
    res.status(500).json({ error: "Failed to generate workflow plan" });
  }
});

// Revise step
app.post("/api/revise-step", async (req, res) => {
  try {
    const { stepId, instruction } = req.body;

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
    const revisedStep = {
      ...response.steps[0],
      aiAgent: "GPT-4",
    };

    res.json(revisedStep);
  } catch (error) {
    console.error("Error revising step:", error);
    res.status(500).json({ error: "Failed to revise step" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
