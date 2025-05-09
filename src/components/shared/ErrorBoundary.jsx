// src/components/common/ErrorFallback.jsx
import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 text-center">
      <div className="p-6 rounded bg-white shadow-lg max-w-md">
        <h1 className="text-xl font-semibold text-red-600">Something went wrong.</h1>
        <p className="mt-2 text-sm text-gray-700">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
