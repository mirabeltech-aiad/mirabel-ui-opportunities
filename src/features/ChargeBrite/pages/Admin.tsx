
import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ocean-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            System administration and configuration management
          </p>
        </div>
        
        <AdminDashboard />
      </main>
      
      <ScrollToTopButton />
    </div>
  );
};

export default Admin;
