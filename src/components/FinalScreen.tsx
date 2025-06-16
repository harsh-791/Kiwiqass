import React from "react";
import {
  CheckCircle,
  Download,
  Share,
  RotateCcw,
  ExternalLink,
  Plus,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export function FinalScreen() {
  const { currentPlan, setAppState } = useApp();

  if (!currentPlan) {
    return null;
  }

  const handleStartOver = () => {
    setAppState("input");
  };

  const handleDownload = () => {
    const planData = {
      goal: currentPlan.goal,
      steps: currentPlan.steps,
      createdAt: currentPlan.createdAt,
      approvedAt: new Date(),
    };

    const blob = new Blob([JSON.stringify(planData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-plan-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Workflow Plan",
          text: `Check out this workflow plan: ${currentPlan.goal}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `AI Workflow Plan\n\nGoal: ${
        currentPlan.goal
      }\n\nSteps:\n${currentPlan.steps
        .map(
          (step, index) => `${index + 1}. ${step.title}\n   ${step.description}`
        )
        .join("\n\n")}`;

      navigator.clipboard.writeText(shareText);
      alert("Plan copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/20 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl mb-6 shadow-lg shadow-green-500/25">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Plan Approved! 🎉
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Your workflow plan is ready for execution
          </p>
          <p className="text-lg text-gray-400">
            Goal:{" "}
            <span className="font-medium text-gray-200">
              {currentPlan.goal}
            </span>
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-400 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-white">Download your plan</h3>
                <p className="text-sm text-gray-400">
                  Save the complete workflow as a JSON file for your records
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-400 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-white">Share with your team</h3>
                <p className="text-sm text-gray-400">
                  Collaborate and get feedback from stakeholders
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-blue-400 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-white">Execute step by step</h3>
                <p className="text-sm text-gray-400">
                  Follow the plan systematically for best results
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-700/60 rounded-lg p-4 text-center border border-gray-600">
            <div className="text-2xl font-bold text-white mb-1">
              {currentPlan.steps.length}
            </div>
            <div className="text-sm text-gray-400">Steps in Plan</div>
          </div>
          <div className="bg-gray-700/60 rounded-lg p-4 text-center border border-gray-600">
            <div className="text-2xl font-bold text-white mb-1">
              {Math.round(
                (currentPlan.steps.reduce(
                  (sum, step) => sum + step.confidence,
                  0
                ) /
                  currentPlan.steps.length) *
                  100
              )}
              %
            </div>
            <div className="text-sm text-gray-400">Avg. Confidence</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 font-medium shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            Download Plan
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex-1 font-medium"
          >
            <Share className="w-4 h-4" />
            Share Plan
          </button>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={handleStartOver}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg shadow-purple-500/25 w-full mt-4"
          >
            <Plus className="w-4 h-4" />
            Create Another Plan
          </button>
        </div>
      </div>
    </div>
  );
}
