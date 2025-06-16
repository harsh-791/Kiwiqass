import React, { useState } from "react";
import {
  Edit3,
  Trash2,
  ChevronUp,
  ChevronDown,
  Brain,
  PenTool as Tool,
  CheckCircle,
  XCircle,
  RotateCcw,
  MessageSquare,
  GripVertical,
} from "lucide-react";
import { WorkflowStep as WorkflowStepType } from "../types";
import { useApp } from "../context/AppContext";
import { reviseStep } from "../services/aiService";

interface WorkflowStepProps {
  step: WorkflowStepType;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
  dragHandleProps?: {
    [key: string]: any;
  };
}

export function WorkflowStep({
  step,
  isFirst,
  isLast,
  totalSteps,
  dragHandleProps,
}: WorkflowStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStep, setEditedStep] = useState(step);
  const [isRevising, setIsRevising] = useState(false);
  const [revisionInstruction, setRevisionInstruction] = useState("");
  const [showRevision, setShowRevision] = useState(false);

  const { updateStep, deleteStep, reorderSteps } = useApp();

  const handleSave = () => {
    updateStep(step.id, editedStep);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStep(step);
    setIsEditing(false);
  };

  const handleMoveUp = () => {
    reorderSteps(step.order, step.order - 1);
  };

  const handleMoveDown = () => {
    reorderSteps(step.order, step.order + 1);
  };

  const handleRevise = async () => {
    if (!revisionInstruction.trim()) return;

    setIsRevising(true);
    try {
      const revisedStep = await reviseStep(step.id, revisionInstruction);
      updateStep(step.id, revisedStep);
      setShowRevision(false);
      setRevisionInstruction("");
    } catch (error) {
      console.error("Failed to revise step:", error);
    } finally {
      setIsRevising(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9)
      return "text-green-400 bg-green-500/20 border-green-500/30";
    if (confidence >= 0.7)
      return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center gap-2">
          <div
            {...dragHandleProps}
            className="cursor-grab p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/25">
            {step.order + 1}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedStep.title}
                onChange={(e) =>
                  setEditedStep((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg font-semibold text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Step title"
              />
              <textarea
                value={editedStep.description}
                onChange={(e) =>
                  setEditedStep((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Step description"
              />
              <input
                type="text"
                value={editedStep.toolName}
                onChange={(e) =>
                  setEditedStep((prev) => ({
                    ...prev,
                    toolName: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tool name"
              />
              <textarea
                value={editedStep.reasoning}
                onChange={(e) =>
                  setEditedStep((prev) => ({
                    ...prev,
                    reasoning: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="AI reasoning"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {step.description}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Tool className="w-4 h-4 text-blue-400" />
                  <span className="font-medium text-blue-400">
                    {step.toolName}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400">{step.aiAgent}</span>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(
                    step.confidence
                  )}`}
                >
                  {Math.round(step.confidence * 100)}% confident
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300">
                    AI Reasoning
                  </span>
                </div>
                <p className="text-sm text-gray-400 italic">{step.reasoning}</p>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={() => setShowRevision(!showRevision)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI to revise
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleMoveUp}
                  disabled={isFirst}
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleMoveDown}
                  disabled={isLast}
                  className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => deleteStep(step.id)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}

          {showRevision && (
            <div className="mt-4 p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
              <h4 className="text-sm font-medium text-purple-300 mb-2">
                How should I revise this step?
              </h4>
              <textarea
                value={revisionInstruction}
                onChange={(e) => setRevisionInstruction(e.target.value)}
                placeholder="e.g., Make it more specific, add security considerations, break into smaller steps..."
                className="w-full px-3 py-2 border border-purple-500/30 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                rows={2}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleRevise}
                  disabled={!revisionInstruction.trim() || isRevising}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isRevising ? (
                    <RotateCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {isRevising ? "Revising..." : "Revise Step"}
                </button>
                <button
                  onClick={() => {
                    setShowRevision(false);
                    setRevisionInstruction("");
                  }}
                  className="px-3 py-1.5 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
