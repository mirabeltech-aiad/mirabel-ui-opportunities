import React from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@OpportunityComponents/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@OpportunityComponents/ui/card';
import { Alert, AlertDescription } from '@OpportunityComponents/ui/alert';

const ApiErrorState = ({ 
  error, 
  onRefresh, 
  title = "API Connection Error",
  description = "Unable to fetch data from the server"
}) => {
  const getErrorDetails = (error) => {
    if (typeof error === 'string') {
      return { message: error, type: 'general' };
    }
    
    if (error?.message) {
      if (error.message.includes('Network')) {
        return { message: 'Network connection failed', type: 'network' };
      }
      if (error.message.includes('timeout')) {
        return { message: 'Request timed out', type: 'timeout' };
      }
      if (error.message.includes('404')) {
        return { message: 'API endpoint not found', type: 'notfound' };
      }
      if (error.message.includes('403') || error.message.includes('401')) {
        return { message: 'Authentication required', type: 'auth' };
      }
      return { message: error.message, type: 'general' };
    }
    
    return { message: 'Unknown error occurred', type: 'general' };
  };

  const errorDetails = getErrorDetails(error);
  
  const getIcon = () => {
    switch (errorDetails.type) {
      case 'network':
        return <Wifi className="h-8 w-8 text-red-500" />;
      case 'timeout':
        return <RefreshCw className="h-8 w-8 text-orange-500" />;
      default:
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
    }
  };

  const getSuggestion = () => {
    switch (errorDetails.type) {
      case 'network':
        return 'Please check your internet connection and try again.';
      case 'timeout':
        return 'The request took too long to complete. Please try again.';
      case 'notfound':
        return 'The requested API endpoint is not available.';
      case 'auth':
        return 'Please log in again to access this data.';
      default:
        return 'Please refresh the page or contact support if the problem persists.';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {getIcon()}
        </div>
        <CardTitle className="text-ocean-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {errorDetails.message}
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-gray-600 text-center">
          {getSuggestion()}
        </p>
        
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            className="w-full bg-ocean-500 text-white hover:bg-ocean-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiErrorState; 