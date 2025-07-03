
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@OpportunityComponents/ui/button';
import apiService from '@/services/apiService';

const SettingsPanel = ({ isOpen, onClose }) => {
  const [startPage, setStartPage] = useState('Quick Search/Results');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await apiService.get('/services/Reports/Settings/1/-1');
      console.log('Settings API response:', response);
      
      if (response?.content?.Data?.ShowType !== undefined) {
        const showType = response.content.Data.ShowType;
        // ShowType 1 = Quick Search/Results, ShowType 0 = Search/Criteria
        setStartPage(showType === 1 ? 'Quick Search/Results' : 'Search/Criteria');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      // Map the startPage value to ShowType
      // Quick Search/Results = 1, Search/Criteria = 0
      const showType = startPage === 'Quick Search/Results' ? 1 : 0;
      
      const payload = {
        PageTypeId: 1,
        ShowType: showType,
        viewId: -1
      };

      console.log('Updating settings with payload:', payload);
      
      const response = await apiService.post('/services/Reports/Settings/', payload);
      console.log('Settings update response:', response);
      
      // Close the panel after successful update
      onClose();
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-sm hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading settings...</div>
            ) : (
              <div className="space-y-6">
                {/* Start Page Setting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Start Page
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="search-criteria"
                        name="startPage"
                        value="Search/Criteria"
                        checked={startPage === 'Search/Criteria'}
                        onChange={(e) => setStartPage(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="search-criteria" className="ml-2 text-sm text-gray-700">
                        Search/Criteria
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="quick-search"
                        name="startPage"
                        value="Quick Search/Results"
                        checked={startPage === 'Quick Search/Results'}
                        onChange={(e) => setStartPage(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="quick-search" className="ml-2 text-sm text-gray-700">
                        Quick Search/Results
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end">
              <Button 
                onClick={handleUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6"
                disabled={loading || updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
