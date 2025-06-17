import React from "react";
import { Plus, ArrowRight, RotateCcw, Undo, Redo } from "lucide-react";
import { useApp } from "../context/AppContext";
import SortableSteps from "./SortableSteps";

export function WorkflowPlanning() {
  const {
    currentPlan,
    setAppState,
    addStep,
    undo,
    redo,
    canUndo,
    canRedo,
    updateSteps,
    deleteStep,
    editStep,
    reviseStep,
  } = useApp();

  if (!currentPlan) {
    return null;
  }

  const handleAddStep = () => {
    addStep({
      title: "New Step",
      description: "Describe what needs to be done in this step",
      toolName: "Tool Name",
      reasoning: "Explain why this step is necessary",
      confidence: 0.8,
      aiAgent: "Manual Entry",
    });
  };

  const handleProceedToReview = () => {
    setAppState("review");
  };

  const handleReorder = (newSteps) => {
    updateSteps(newSteps);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 p-4 sm:p-2">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 sm:p-3 mb-6 shadow-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-white">Workflow Plan</h1>
              <p className="text-gray-300 mt-1">Goal: {currentPlan.goal}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo className="w-5 h-5" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{currentPlan.steps.length} steps</span>
            <span>•</span>
            <span>
              Last updated: {currentPlan.updatedAt.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <SortableSteps
            steps={currentPlan.steps.sort((a, b) => a.order - b.order)}
            onReorder={handleReorder}
            onEdit={editStep}
            onDelete={deleteStep}
            onRevise={reviseStep}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleAddStep}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>

          <div className="flex-1 hidden sm:block" />

          <button
            onClick={() => setAppState("input")}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>

          <button
            onClick={handleProceedToReview}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25 w-full sm:w-auto"
          >
            Review Plan
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
