import React from 'react';
import { useTabs } from '../../context/TabContext';
import TabContentRenderer from './TabContentRenderer';

const TabContent: React.FC = () => {
  const { tabs, activeTabId } = useTabs();
  
  const activeTab = tabs.find(tab => tab.id === activeTabId);
  
  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-muted-foreground mb-2">
            No Tab Selected
          </h2>
          <p className="text-sm text-muted-foreground">
            Please select a tab to view its content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <TabContentRenderer tab={activeTab} />
    </div>
  );
};

export default TabContent;