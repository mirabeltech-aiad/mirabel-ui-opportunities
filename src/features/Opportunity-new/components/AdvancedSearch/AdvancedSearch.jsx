import React, { useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Settings, Search } from 'lucide-react';
import MultiSelectField from './MultiSelectField';
import DateRangeField from './DateRangeField';
import TestSearchResults from '../SearchResults/TestSearchResults';
import opportunitiesConfig from './configs/opportunitiesConfig';
import proposalsConfig from './configs/proposalsConfig';

const AdvancedSearch = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [opportunitiesFormData, setOpportunitiesFormData] = useState({});
  const [proposalsFormData, setProposalsFormData] = useState({});
  const [opportunitiesExpandedSections, setOpportunitiesExpandedSections] = useState({});
  const [proposalsExpandedSections, setProposalsExpandedSections] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  const currentConfig = activeTab === 'opportunities' ? opportunitiesConfig : proposalsConfig;

  const handleFieldChange = (sectionName, fieldKey, value) => {
    const fieldKeyWithSection = `${sectionName}_${fieldKey}`;
    
    if (activeTab === 'opportunities') {
      setOpportunitiesFormData(prev => ({
        ...prev,
        [fieldKeyWithSection]: value
      }));
    } else {
      setProposalsFormData(prev => ({
        ...prev,
        [fieldKeyWithSection]: value
      }));
    }
  };

  const handleReset = () => {
    if (activeTab === 'opportunities') {
      setOpportunitiesFormData({});
    } else {
      setProposalsFormData({});
    }
  };

  const toggleSection = (sectionName) => {
    if (activeTab === 'opportunities') {
      setOpportunitiesExpandedSections(prev => ({
        ...prev,
        [sectionName]: !prev[sectionName]
      }));
    } else {
      setProposalsExpandedSections(prev => ({
        ...prev,
        [sectionName]: !prev[sectionName]
      }));
    }
  };

  const toggleAllSections = () => {
    const allSections = currentConfig.map(section => section.sectionName);
    const currentExpandedSections = activeTab === 'opportunities' 
      ? opportunitiesExpandedSections 
      : proposalsExpandedSections;
    
    // Check if all sections are currently expanded
    const allExpanded = allSections.every(sectionName => 
      currentExpandedSections[sectionName] !== false
    );
    
    const newState = {};
    allSections.forEach(sectionName => {
      newState[sectionName] = !allExpanded; // If all expanded, collapse all; if not, expand all
    });
    
    if (activeTab === 'opportunities') {
      setOpportunitiesExpandedSections(newState);
    } else {
      setProposalsExpandedSections(newState);
    }
  };

  // Check if all sections are expanded to determine button text and icon
  const currentExpandedSections = activeTab === 'opportunities' 
    ? opportunitiesExpandedSections 
    : proposalsExpandedSections;
    
  const allSectionsExpanded = currentConfig.every(section => 
    currentExpandedSections[section.sectionName] !== false
  );

  const handleSearch = () => {
    const currentFormData = activeTab === 'opportunities' ? opportunitiesFormData : proposalsFormData;
    setSearchParams(currentFormData);
    setShowResults(true);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
  };

  // If showing results, render the TestSearchResults component
  if (showResults) {
    return (
      <TestSearchResults
        searchType={activeTab}
        searchParams={searchParams}
        onBackToSearch={handleBackToSearch}
      />
    );
  }

  const renderSection = (section) => {
    const isExpanded = currentExpandedSections[section.sectionName] !== false; // Default to expanded

    return (
      <div key={section.sectionName} className="mb-6">
        <button
          onClick={() => toggleSection(section.sectionName)}
          className="flex items-center justify-between w-full text-left mb-4 hover:bg-gray-50 p-3 rounded-md transition-colors cursor-pointer border-b border-gray-200 pb-3"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-1 h-6 rounded ${section.sectionName === 'Quick Search' ? 'bg-blue-600' : 'bg-orange-500'}`}></div>
            <h3 className="text-lg font-semibold text-blue-900">{section.sectionName}</h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          )}
        </button>

        {isExpanded && (
          <div className="grid grid-cols-3 gap-6 pt-4">
            {section.fields.map((field, index) => {
              const fieldKeyWithSection = `${section.sectionName}_${field.key}`;
              const currentFormData = activeTab === 'opportunities' ? opportunitiesFormData : proposalsFormData;
              if (field.type === 'dateRange') {
                const fromKeyWithSection = `${section.sectionName}_${field.fromKey}`;
                const toKeyWithSection = `${section.sectionName}_${field.toKey}`;
                
                return (
                  <DateRangeField
                    key={field.key}
                    label={field.label}
                    fromKey={field.fromKey}
                    toKey={field.toKey}
                    value={{
                      from: currentFormData[fromKeyWithSection] || '',
                      to: currentFormData[toKeyWithSection] || ''
                    }}
                    onChange={(key, value) => handleFieldChange(section.sectionName, key, value)}
                    placeholder={`Select ${field.label.toLowerCase()} range...`}
                  />
                );
              }
              
              return (
                <MultiSelectField
                  key={field.key}
                  label={field.label}
                  value={currentFormData[fieldKeyWithSection] || []}
                  onChange={(value) => handleFieldChange(section.sectionName, field.key, value)}
                  placeholder={`Select ${field.label.toLowerCase()}...`}
                  fieldKey={field.key}
                  tabType={activeTab}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold text-blue-900">Advanced Search - {activeTab === 'opportunities' ? 'Opportunities' : 'Proposals'}</h1>
            <button 
              onClick={toggleAllSections}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 text-sm"
            >
              <span>{allSectionsExpanded ? 'Collapse All' : 'Expand All'}</span>
              {allSectionsExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button 
              onClick={handleSearch}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Search className="h-4 w-4" />
              <span>Search {activeTab === 'opportunities' ? 'Opportunities' : 'Proposals'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Advanced Search</h2>
              
              {/* Tabs */}
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'opportunities'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Opportunities
                </button>
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'proposals'
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  Proposals
                </button>
              </div>
            </div>

            {/* Dynamic Content based on active tab */}
            <div className="px-6 py-4">
              {currentConfig.map(section => renderSection(section))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;