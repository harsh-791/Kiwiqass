import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg shadow-blue-500/25"></div>
          <div className="relative bg-gray-800 rounded-full p-4">
            <Brain className="w-8 h-8 text-blue-400 animate-bounce" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          AI is crafting your workflow...
        </h2>
        
        <p className="text-gray-300 mb-6 max-w-md mx-auto">
          Our AI agents are analyzing your goal and creating a detailed, step-by-step plan
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
          <span>This usually takes 5-7 seconds</span>
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}