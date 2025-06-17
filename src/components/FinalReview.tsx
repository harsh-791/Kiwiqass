import React from "react";
import {
  CheckCircle,
  XCircle,
  Edit,
  ArrowLeft,
  Target,
  Clock,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function FinalReview() {
  const { currentPlan, setAppState, updateStep } = useApp();

  if (!currentPlan) {
    return null;
  }

  const handleApprove = () => {
    updateStep(currentPlan.steps[0]?.id, { ...currentPlan.steps[0] });
    setAppState("final");
  };

  const handleCancel = () => {
    setAppState("input");
  };

  const handleBackToEdit = () => {
    setAppState("planning");
  };

  const averageConfidence =
    currentPlan.steps.reduce((sum, step) => sum + step.confidence, 0) /
    currentPlan.steps.length;
  const uniqueTools = [
    ...new Set(currentPlan.steps.map((step) => step.toolName)),
  ];
  const uniqueAgents = [
    ...new Set(currentPlan.steps.map((step) => step.aiAgent)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 sm:p-2">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 sm:p-3 shadow-lg border border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-green-500/25">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Final Review</h1>
            <p className="text-lg text-gray-300">
              Review your complete workflow plan before approval
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Goal</h2>
            <p className="text-lg text-gray-300">{currentPlan.goal}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700/60 rounded-lg p-4 text-center border border-gray-600">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {currentPlan.steps.length}
              </div>
              <div className="text-sm text-gray-400">Total Steps</div>
            </div>

            <div className="bg-gray-700/60 rounded-lg p-4 text-center border border-gray-600">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {Math.round(averageConfidence * 100)}%
              </div>
              <div className="text-sm text-gray-400">Avg. Confidence</div>
            </div>

            <div className="bg-gray-700/60 rounded-lg p-4 text-center border border-gray-600">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {uniqueTools.length}
              </div>
              <div className="text-sm text-gray-400">Tools Required</div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Step-by-Step Plan
              </h3>
              <div className="space-y-3">
                {currentPlan.steps
                  .sort((a, b) => a.order - b.order)
                  .map((step, index) => (
                    <div
                      key={step.id}
                      className="bg-gray-700/60 rounded-lg p-4 border border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">
                            {step.title}
                          </h4>
                          <p className="text-gray-300 text-sm mb-2">
                            {step.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>Tool: {step.toolName}</span>
                            <span>•</span>
                            <span>Agent: {step.aiAgent}</span>
                            <span>•</span>
                            <span>
                              Confidence: {Math.round(step.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Tools & Agents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-700/60 rounded-lg p-4 border border-gray-600">
                  <h4 className="font-medium text-white mb-2">
                    Tools Required
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-700/60 rounded-lg p-4 border border-gray-600">
                  <h4 className="font-medium text-white mb-2">AI Agents</h4>
                  <div className="flex flex-wrap gap-2">
                    {uniqueAgents.map((agent) => (
                      <span
                        key={agent}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleBackToEdit}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>

            <div className="flex-1 hidden sm:block" />

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>

            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-green-500/25 w-full sm:w-auto"
            >
              <CheckCircle className="w-5 h-5" />
              Approve Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
