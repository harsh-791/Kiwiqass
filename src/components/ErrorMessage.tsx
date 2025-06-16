import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ErrorMessage() {
  const { error, setError, setAppState } = useApp();

  const handleRetry = () => {
    setError(null);
    // Could implement retry logic here
  };

  const handleGoBack = () => {
    setError(null);
    setAppState('input');
  };

  if (!error) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-300 mb-6">
          {error}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}