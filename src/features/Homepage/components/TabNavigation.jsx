import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHome } from '../contexts/HomeContext';
import Navbar from './Navbar';
import TabContent from './TabContent';
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
    actions.removeTab(tabId);
  };

  const addNewTab = () => {
    actions.addTab({
      title: 'New Tab',
      component: 'NewTab',
      type: 'component',
      icon: '📄'
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
      <div className="bg-white border-b border-gray-200 flex items-center justify-between px-4 py-2">
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
                          {...provided.dragHandleProps}
                          className={`flex items-center px-3 py-2 rounded-t-lg cursor-pointer transition-all duration-200 ${
                            activeTabId === tab.id
                              ? 'bg-white border-t-2 border-blue-500 text-blue-600 shadow-sm'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <span className="mr-2 text-sm">{tab.icon}</span>
                          <span className="text-sm font-medium truncate max-w-32">
                            {tab.title}
                          </span>
                          {tab.closable && (
                            <button
                              onClick={(e) => handleTabClose(e, tab.id)}
                              className="ml-2 p-1 rounded hover:bg-gray-300 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
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
                    {tab.closable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClose(e, tab.id);
                        }}
                        className="ml-2 p-1 rounded hover:bg-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Add Tab Button */}
          <button
            onClick={addNewTab}
            className="ml-2 p-2 rounded hover:bg-gray-200 transition-colors"
            title="Add new tab"
          >
            <Plus className="h-4 w-4" />
          </button>
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