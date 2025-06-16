import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GoalInput } from './components/GoalInput';
import { WorkflowPlanning } from './components/WorkflowPlanning';
import { FinalReview } from './components/FinalReview';
import { FinalScreen } from './components/FinalScreen';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function AppContent() {
  const { appState, isLoading, error } = useApp();

  if (error) {
    return <ErrorMessage />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  switch (appState) {
    case 'input':
      return <GoalInput />;
    case 'planning':
      return <WorkflowPlanning />;
    case 'review':
      return <FinalReview />;
    case 'final':
      return <FinalScreen />;
    default:
      return <GoalInput />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;