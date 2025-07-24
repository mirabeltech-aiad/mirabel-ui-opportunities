import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHome } from '../contexts/HomeContext';
import { initializePageNavigation, cleanupPageNavigation } from '@/utils/pageNavigation';
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
import { getSessionValue } from '@/utils/sessionHelpers';

const TabNavigation = () => {
  const { tabs, activeTabId, actions, dashboards, selectedDashboard, dashboardsLoading } = useHome();

  // Context menu state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, tabId: null });
  const contextMenuRef = useRef(null);

  // Hide context menu on click outside, scroll, or blur
  useEffect(() => {
    const handleCloseMenu = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    const handleScrollOrBlur = () => {
      setContextMenu((prev) => ({ ...prev, visible: false }));
    };
    if (contextMenu.visible) {
      document.addEventListener('mousedown', handleCloseMenu);
      window.addEventListener('scroll', handleScrollOrBlur, true);
      window.addEventListener('blur', handleScrollOrBlur);
    }
    return () => {
      document.removeEventListener('mousedown', handleCloseMenu);
      window.removeEventListener('scroll', handleScrollOrBlur, true);
      window.removeEventListener('blur', handleScrollOrBlur);
    };
  }, [contextMenu.visible]);

  // // Initialize page navigation helpers when component mounts
  useEffect(() => {
    console.log('Initializing page navigation helpers in TabNavigation');
    initializePageNavigation(actions);

    // Cleanup function
    return () => {
      console.log('Cleaning up page navigation helpers in TabNavigation');
      cleanupPageNavigation();
    };
  }, [actions]);

  // Split tabs into fixed and draggable
  // Only Inbox and Search are fixed tabs now (remove Dashboard tab)
  const fixedTabsCount = 2; // Inbox, Search
  const fixedTabs = tabs.slice(1, 3); // skip the first tab (Dashboard)
  const draggableTabs = tabs.slice(3);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // Only reorder draggable tabs
    const items = Array.from(draggableTabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Merge fixed and reordered draggable tabs
    const newTabs = [...fixedTabs, ...items];
    actions.reorderTabs(newTabs);
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

  // Context menu actions
  const handleContextMenu = (e, tabId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, tabId });
  };

  // Helper: is tab fixed?
  const isFixedTab = (tabId) => {
    return tabs.findIndex((tab) => tab.id === tabId) < fixedTabsCount;
  };
  // Helper: non-fixed tabs
  const nonFixedTabs = tabs.slice(fixedTabsCount);
  const nonFixedTabsCount = nonFixedTabs.length;
  const isRightClickFixed = isFixedTab(contextMenu.tabId);
  const onlyFixedTabs = nonFixedTabsCount === 0;
  const onlyOneNonFixedTab = nonFixedTabsCount === 1 && !isRightClickFixed;
  const moreThanOneNonFixedTab = nonFixedTabsCount > 1 && !isRightClickFixed;

  const handleCloseTab = () => {
    actions.removeTab(contextMenu.tabId);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  const handleCloseOtherTabs = () => {
    tabs.forEach((tab) => {
      if (tab.id !== contextMenu.tabId && tab.closable !== false) {
        actions.removeTab(tab.id);
      }
    });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  const handleCloseAllTabs = () => {
    tabs.forEach((tab) => {
      if (tab.closable !== false) {
        actions.removeTab(tab.id);
      }
    });
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  // Split tabs into visible and overflow
  const maxVisibleTabs = 8;
  const visibleTabs = tabs.slice(0, maxVisibleTabs);
  const overflowTabs = tabs.slice(maxVisibleTabs);

  const handleDashboardSelect = async (dashboard) => {
    if (!dashboard) return;
    let url = dashboard.URL;
    if (url && url.toUpperCase().includes('ISMKM=1')) {
      const token = getSessionValue('Token');
      url += (url.includes('?') ? '&' : '?') + 'accesstoken=' + token;
    }
    actions.setSelectedDashboard({ ...dashboard, URL: url });
    actions.setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      {/* Tab Bar */}
      <div className="bg-white border-b border-gray-200 flex items-center px-2 py-0 h-9 min-h-0" style={{ boxShadow: '0 1px 0 0 #e5e7eb', height: '28px', minHeight: '28px', fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5' }}>
        {/* Sales Dashboard Dropdown - now in TabNavigation */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`px-2 py-1 rounded font-medium text-xs transition flex items-center h-8 min-h-0 ${
                  activeTabId === 'dashboard' ? 'bg-blue-100 text-blue-900 font-bold shadow-sm' : 'bg-transparent text-gray-700 hover:bg-gray-100'
                }`}
                style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', minWidth: 120, border: 'none', boxShadow: activeTabId === 'dashboard' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
              >
                {selectedDashboard ? selectedDashboard.DashBoardName : 'Sales Dashboard'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-2 bg-white border border-gray-100 p-0 text-gray-800 font-medium">
              {dashboardsLoading ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : (
                dashboards.map((dashboard) => (
                  <DropdownMenuItem
                    key={dashboard.ID}
                    onClick={() => handleDashboardSelect(dashboard)}
                    className={
                      selectedDashboard && selectedDashboard.ID === dashboard.ID
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : ''
                    }
                  >
                    {dashboard.DashBoardName}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* End Sales Dashboard Dropdown */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Render fixed tabs (Inbox, Search only) */}
          {fixedTabs.map((tab, index) => (
            <div
              key={tab.id}
              onContextMenu={(e) => handleContextMenu(e, tab.id)}
              className={`flex items-center rounded transition-all duration-200 h-8 min-h-0 px-1 text-xs ${
                activeTabId === tab.id
                  ? 'bg-blue-100 text-blue-900 font-bold shadow-sm'
                  : 'bg-transparent hover:bg-gray-100 text-gray-700'
              }`}
              style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', border: 'none', boxShadow: activeTabId === tab.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', marginRight: '1px', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
            >
              <div
                className="flex items-center px-1 py-0 cursor-pointer flex-1 h-8 min-h-0"
                onClick={() => handleTabClick(tab.id)}
                style={{ fontSize: '13px' }}
              >
                <span className="mr-0.5 text-xs flex items-center" style={{ fontSize: '13px' }}>{tab.icon}</span>
                <span className="text-xs font-medium truncate max-w-32 flex items-center" style={{ fontSize: '13px', marginRight: '2px' }}>
                  {tab.title}
                </span>
              </div>
              {/* Close button (not draggable, but should not appear for fixed tabs) */}
              {tab.closable !== false && (
                <button
                  onClick={(e) => handleTabClose(e, tab.id)}
                  className="mr-1 p-0 rounded hover:bg-gray-200 transition-colors flex-shrink-0 h-5 w-5 min-h-0 flex items-center justify-center"
                  title="Close tab"
                  type="button"
                  style={{ display: 'none' }} // Hide close for fixed tabs visually
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          {/* Draggable tabs (after the first three) */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tabs" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex items-center space-x-0.5 flex-1 min-w-0"
                  style={{ gap: '1px' }}
                >
                  {draggableTabs.map((tab, index) => (
                    <Draggable key={tab.id} draggableId={tab.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onContextMenu={(e) => handleContextMenu(e, tab.id)}
                          className={`flex items-center rounded transition-all duration-200 h-8 min-h-0 px-1 text-xs ${
                            activeTabId === tab.id
                              ? 'bg-blue-100 text-blue-900 font-bold shadow-sm'
                              : 'bg-transparent hover:bg-gray-100 text-gray-700'
                          } ${snapshot.isDragging ? 'opacity-50' : ''}`}
                          style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', border: 'none', boxShadow: activeTabId === tab.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none', marginRight: '1px', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="flex items-center px-1 py-0 cursor-pointer flex-1 h-8 min-h-0"
                            onClick={() => handleTabClick(tab.id)}
                            style={{ fontSize: '13px' }}
                          >
                            <span className="mr-0.5 text-xs flex items-center" style={{ fontSize: '13px' }}>{tab.icon}</span>
                            <span className="text-xs font-medium truncate max-w-32 flex items-center" style={{ fontSize: '13px', marginRight: '2px' }}>
                              {tab.title}
                            </span>
                          </div>
                          {tab.closable !== false && (
                            <button
                              onClick={(e) => handleTabClose(e, tab.id)}
                              className="mr-1 p-0 rounded hover:bg-gray-200 transition-colors flex-shrink-0 h-5 w-5 min-h-0 flex items-center justify-center"
                              title="Close tab"
                              type="button"
                              style={{ marginLeft: '-4px' }}
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
                <button className="flex items-center px-2 py-1 rounded hover:bg-gray-100 transition-colors text-gray-600 bg-transparent" style={{ fontFamily: 'inherit', fontSize: '13px', fontWeight: 500, lineHeight: '1.5', height: '24px', minHeight: '24px', paddingTop: '0', paddingBottom: '0' }}>
                  <ChevronDown className="h-4 w-4" />
                  <span className="ml-1 text-xs" style={{ fontSize: '13px' }}>
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
      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          ref={contextMenuRef}
          style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, zIndex: 9999, minWidth: 180, background: 'white', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          className="rounded shadow-md text-sm"
        >
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(!onlyFixedTabs && !isRightClickFixed) ? handleCloseTab : undefined}
            style={{ pointerEvents: (onlyFixedTabs || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close Tab
          </div>
          <div className="border-t border-gray-200 mx-2" />
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || onlyOneNonFixedTab || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(moreThanOneNonFixedTab ? handleCloseOtherTabs : undefined)}
            style={{ pointerEvents: (onlyFixedTabs || onlyOneNonFixedTab || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close Other Tabs
          </div>
          <div className="border-t border-gray-200 mx-2" />
          <div
            className={`px-4 py-1.5 cursor-pointer hover:bg-blue-100 ${((onlyFixedTabs || isRightClickFixed) ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900')}`}
            onClick={(!onlyFixedTabs && !isRightClickFixed) ? handleCloseAllTabs : undefined}
            style={{ pointerEvents: (onlyFixedTabs || isRightClickFixed) ? 'none' : 'auto', lineHeight: 1.5 }}
          >
            Close All Tabs
          </div>
        </div>
      )}
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <TabContent />
      </div>
    </div>
  );
};

export default TabNavigation; 