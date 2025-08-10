
import React, { useState } from "react";
import { X, List, RotateCcw, User, FileText, Building2, Pin, Phone, Mail, Smartphone, Calendar, CheckSquare } from "lucide-react";

// Complete self-contained side panel component
const CompanySidePanel = ({ selectedCompany = "Sample Company", onClose }) => {
  const [pinnedActivities, setPinnedActivities] = useState(new Set());
  const [activeTab, setActiveTab] = useState("all");
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  // Mock company data
  const [companyData, setCompanyData] = useState({
    industry: "Technology",
    mobile: "+1 (555) 123-4567",
    email: "contact@company.com",
    website: "www.company.com",
    address: "123 Main St, City, State"
  });

  // Mock activities data
  const mockActivities = [
    {
      id: 1,
      type: 'note',
      title: 'Follow-up call scheduled',
      content: 'Discussed project timeline and next steps with the client team',
      date: new Date().toISOString(),
      user: 'John Doe'
    },
    {
      id: 2,
      type: 'email',
      title: 'Proposal sent',
      content: 'Sent detailed project proposal via email with pricing breakdown',
      date: new Date(Date.now() - 86400000).toISOString(),
      user: 'Jane Smith'
    },
    {
      id: 3,
      type: 'call',
      title: 'Discovery call completed',
      content: 'Initial discovery call to understand requirements and pain points',
      date: new Date(Date.now() - 172800000).toISOString(),
      user: 'Mike Johnson'
    },
    {
      id: 4,
      type: 'meeting',
      title: 'Demo scheduled',
      content: 'Product demonstration meeting set for next week',
      date: new Date(Date.now() - 259200000).toISOString(),
      user: 'Sarah Wilson'
    },
    {
      id: 5,
      type: 'task',
      title: 'Technical review pending',
      content: 'Waiting for technical team review of requirements document',
      date: new Date(Date.now() - 345600000).toISOString(),
      user: 'Tom Brown'
    }
  ];

  const handlePinToggle = (activityId) => {
    setPinnedActivities(prev => {
      const newPinned = new Set(prev);
      if (newPinned.has(activityId)) {
        newPinned.delete(activityId);
      } else {
        newPinned.add(activityId);
      }
      return newPinned;
    });
  };

  const sortActivitiesByPin = (activities) => {
    return activities.sort((a, b) => {
      const aIsPinned = pinnedActivities.has(a.id);
      const bIsPinned = pinnedActivities.has(b.id);
      
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      
      return new Date(b.date) - new Date(a.date);
    });
  };

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value || '');
  };

  const saveEdit = () => {
    if (editingField) {
      setCompanyData(prev => ({
        ...prev,
        [editingField]: tempValue
      }));
    }
    setEditingField(null);
    setTempValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingField(null);
      setTempValue('');
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'task': return CheckSquare;
      default: return FileText;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'call': return 'text-green-600';
      case 'email': return 'text-blue-600';
      case 'meeting': return 'text-purple-600';
      case 'task': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const filterActivities = (activities, tab) => {
    if (tab === 'all') return activities;
    return activities.filter(activity => activity.type === tab);
  };

  const iconBarItems = [
    { icon: List, label: "All Notes & Activities", color: "blue", showText: true },
    { icon: RotateCcw, label: "Reload Activities", color: "green", showText: false },
    { icon: User, label: "View Logged in User", color: "purple", showText: false },
    { icon: FileText, label: "View All Notes", color: "orange", showText: false },
    { icon: Building2, label: "View Company Notes & Activities", color: "indigo", showText: false },
    { icon: Pin, label: "Pinned Notes", color: "yellow", showText: false }
  ];

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'note', label: 'Notes' },
    { value: 'call', label: 'Calls' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'email', label: 'Emails' },
    { value: 'task', label: 'Tasks' }
  ];

  const filteredAndSortedActivities = sortActivitiesByPin(filterActivities(mockActivities, activeTab));

  return (
    <div className="w-[420px] min-h-screen bg-gradient-to-br from-slate-50 to-white border-l border-slate-200/60 flex flex-col shadow-xl">
      {/* Blue Gradient Header */}
      <div className="px-5 py-2.5 border-b border-slate-200/50 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold truncate text-white">{selectedCompany}</h2>
            <p className="text-xs text-blue-100 mt-0.5 truncate">{companyData.industry}</p>
          </div>
          <button 
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 ml-3 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="flex-shrink-0 border-b border-slate-100">
        <div className="px-4 py-2.5">
          <div className="flex items-center mb-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Company Details</h3>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 py-1">
                  <Smartphone className="h-3 w-3 text-green-600 flex-shrink-0" />
                  {editingField === 'mobile' ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="text-xs text-slate-700 bg-white border border-blue-300 rounded px-1 py-0.5 flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => startEditing('mobile', companyData.mobile)}
                      className="text-xs text-slate-700 cursor-pointer hover:text-blue-600 transition-colors flex-1 min-w-0 truncate"
                    >
                      {companyData.mobile || 'Click to edit'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 py-1">
                  <Mail className="h-3 w-3 text-blue-600 flex-shrink-0" />
                  {editingField === 'email' ? (
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={handleKeyDown}
                      className="text-xs text-slate-700 bg-white border border-blue-300 rounded px-1 py-0.5 flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => startEditing('email', companyData.email)}
                      className="text-xs text-slate-700 cursor-pointer hover:text-blue-600 transition-colors flex-1 min-w-0 truncate"
                    >
                      {companyData.email || 'Click to edit'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tabs and Content */}
      <div className="flex-1 flex flex-col min-h-0 px-4 py-2.5">
        {/* Tab Navigation */}
        <div className="grid grid-cols-6 h-8 bg-blue-50 border border-blue-200 rounded-md p-0.5 mb-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`text-xs h-7 rounded transition-all ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-700 hover:bg-blue-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Icon Bar */}
        <div className="flex items-center justify-center gap-1 mb-2 overflow-x-auto">
          {iconBarItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className={`flex items-center gap-1 text-xs h-6 px-2 border border-${item.color}-200 text-${item.color}-700 hover:bg-${item.color}-50 rounded transition-colors ${item.showText ? 'min-w-fit' : 'w-6'}`}
                title={item.label}
              >
                <IconComponent className={`h-3 w-3 text-${item.color}-600`} />
                {item.showText && <span className="font-medium">ALL</span>}
              </button>
            );
          })}
        </div>
        
        {/* Activities List */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {filteredAndSortedActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No activities found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                const isPinned = pinnedActivities.has(activity.id);
                
                return (
                  <div
                    key={activity.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      isPinned 
                        ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                        : 'bg-white border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2 flex-1 min-w-0">
                        <IconComponent className={`h-4 w-4 mt-0.5 flex-shrink-0 ${getActivityColor(activity.type)}`} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {activity.content}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {activity.user}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePinToggle(activity.id)}
                        className={`ml-2 p-1 rounded-full transition-colors ${
                          isPinned 
                            ? 'text-yellow-600 hover:text-yellow-700' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={isPinned ? 'Unpin activity' : 'Pin activity'}
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Usage example component
const SidePanelExample = () => {
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Main Content Area</h1>
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showPanel ? 'Hide' : 'Show'} Side Panel
        </button>
      </div>
      
      {showPanel && (
        <CompanySidePanel
          selectedCompany="Acme Corporation"
          onClose={() => setShowPanel(false)}
        />
      )}
    </div>
  );
};

export default SidePanelExample;
export { CompanySidePanel };
