export interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  toolName: string;
  reasoning: string;
  confidence: number;
  aiAgent: string;
  order: number;
}

export interface WorkflowPlan {
  id: string;
  goal: string;
  steps: WorkflowStep[];
  status: 'draft' | 'approved' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type AppState = 'input' | 'planning' | 'review' | 'final';

export interface AppContext {
  currentPlan: WorkflowPlan | null;
  appState: AppState;
  isLoading: boolean;
  error: string | null;
  history: WorkflowPlan[];
  historyIndex: number;
}