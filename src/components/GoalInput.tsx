import React, { useState } from 'react';
import { Target, Zap, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateWorkflowPlan } from '../services/aiService';

const sampleGoals = [
  'Clean up my CRM',
  'Automate invoice processing',
  'Organize project files',
  'Set up customer onboarding',
  'Improve team communication',
];

export function GoalInput() {
  const [goal, setGoal] = useState('');
  const { setGoal: setAppGoal, setAppState, setLoading, setError, setPlan } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);
    setAppGoal(goal);
    
    try {
      const plan = await generateWorkflowPlan(goal);
      setPlan(plan);
      setAppState('planning');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleGoal = (sampleGoal: string) => {
    setGoal(sampleGoal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Workflow Planner
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto">
            Describe your goal in plain English, and I'll create a detailed, editable workflow plan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Zap className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What would you like to accomplish? (e.g., Clean up my CRM, Automate invoice processing...)"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-700 bg-gray-800/80 backdrop-blur-sm rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 resize-none text-lg placeholder-gray-400 text-white"
              rows={3}
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-sm text-gray-400">
              {goal.length}/500
            </div>
          </div>

          <button
            type="submit"
            disabled={!goal.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/25"
          >
            Generate AI Plan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </form>

        <div className="mt-8">
          <p className="text-sm text-gray-400 mb-3 font-medium">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {sampleGoals.map((sampleGoal) => (
              <button
                key={sampleGoal}
                onClick={() => handleSampleGoal(sampleGoal)}
                className="px-4 py-2 bg-gray-800/60 border border-gray-600 rounded-lg text-sm text-gray-300 hover:bg-gray-700/60 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm"
              >
                {sampleGoal}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}