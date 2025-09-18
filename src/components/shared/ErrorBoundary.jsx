// src/components/common/ErrorFallback.jsx
import React from 'react';
import { Button } from '../ui/button';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  console.log("ErrorFallback", error);
  return (
    <div className="flex justify-center items-center min-h-screen text-center bg-red-50">
      <div className="p-6 max-w-md bg-white rounded shadow-lg">
        <h1 className="text-xl font-semibold text-red-600">Something went wrong.</h1>
        <p className="mt-2 text-sm text-gray-700">{error.message}</p>
        <Button onClick={resetErrorBoundary} variant="destructive" className='mt-4'>Try again</Button>
      </div>
    </div>
  );
};

export default ErrorFallback;
