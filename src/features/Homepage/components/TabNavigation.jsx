import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHome } from '../contexts/HomeContext';
import Navbar from './Navbar';
import TabContent from './TabContent';
import DashboardTab from './DashboardTab';
import { Plus, X, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TabNavigation = () => {
  const { tabs, activeTabId, actions } = useHome();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    actions.reorderTabs(items);
  };

  const handleTabClick = (tabId) => {
    actions.setActiveTab(tabId);
  };

  const handleTabClose = (e, tabId) => {
    e.stopPropagation();
    e.preventDefault();
    actions.removeTab(tabId);
  };

  const addNewTab = () => {
    actions.addTab({
      title: 'New Tab',
      component: 'NewTab',
      type: 'component',
      icon: '📄',
      closable: true
    });
  };

  // Split tabs into visible and overflow
  const maxVisibleTabs = 8;
  const visibleTabs = tabs.slice(0, maxVisibleTabs);
  const overflowTabs = tabs.slice(maxVisibleTabs);

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex items-center px-2 py-0 h-8 min-h-0">
        <div className="flex items-center flex-1 min-w-0">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tabs" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex items-center space-x-1 flex-1 min-w-0"
                >
                  {visibleTabs.map((tab, index) => (
                    <Draggable key={tab.id} draggableId={tab.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center rounded-t-lg transition-all duration-200 h-7 min-h-0 px-2 text-xs ${
                            activeTabId === tab.id
                              ? 'bg-white border-t-2 border-blue-500 text-blue-600 shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                        >
                          {tab.id === 'dashboard' ? (
                            <div {...provided.dragHandleProps}>
                              <DashboardTab
                                tab={tab}
                                isActive={activeTabId === tab.id}
                                onClick={handleTabClick}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          ) : (
                            <>
                              {/* Draggable area (excludes close button) */}
                              <div
                                {...provided.dragHandleProps}
                                className="flex items-center px-1 py-0 cursor-pointer flex-1 h-7 min-h-0"
                                onClick={() => handleTabClick(tab.id)}
                              >
                                <span className="mr-1 text-xs flex items-center">{tab.icon}</span>
                                <span className="text-xs font-medium truncate max-w-32 flex items-center">
                                  {tab.title}
                                </span>
                              </div>
                              {/* Close button (not draggable) */}
                              {tab.closable !== false && (
                                <button
                                  onClick={(e) => handleTabClose(e, tab.id)}
                                  className="mr-1 p-0 rounded hover:bg-gray-300 transition-colors flex-shrink-0 h-5 w-5 min-h-0 flex items-center justify-center"
                                  title="Close tab"
                                  type="button"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Overflow Menu */}
          {overflowTabs.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-2 py-1 rounded hover:bg-gray-200 transition-colors">
                  <ChevronDown className="h-4 w-4" />
                  <span className="ml-1 text-sm text-gray-600">
                    +{overflowTabs.length}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {overflowTabs.map((tab) => (
                  <DropdownMenuItem
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{tab.icon}</span>
                      <span className="truncate">{tab.title}</span>
                    </div>
                    {tab.closable !== false && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleTabClose(e, tab.id);
                        }}
                        className="ml-2 p-1 rounded hover:bg-gray-200"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <TabContent />
      </div>
    </div>
  );
};

export default TabNavigation; 