// Utility functions for Kanban drag and drop ID management

// Registry to track active draggable IDs for debugging
const activeDraggableIds = new Set();

export const registerDraggableId = (id) => {
  activeDraggableIds.add(id);
  console.log(`📝 Registered draggable ID: ${id}. Total active: ${activeDraggableIds.size}`);
};

export const unregisterDraggableId = (id) => {
  activeDraggableIds.delete(id);
  console.log(`🗑️ Unregistered draggable ID: ${id}. Total active: ${activeDraggableIds.size}`);
};

export const getActiveDraggableIds = () => {
  return Array.from(activeDraggableIds);
};

export const isDraggableIdActive = (id) => {
  return activeDraggableIds.has(id);
};

/**
 * Get consistent opportunity ID for drag and drop operations
 * This ensures the same ID is used in both Draggable creation and drag result handling
 */
export const getOpportunityDragId = (opportunity, index = 0) => {
  // Ensure we have a valid ID - react-beautiful-dnd requires string IDs
  const id = opportunity.ID || opportunity.id;
  
  if (!id) {
    console.error('❌ No ID found for opportunity:', opportunity);
    // Fallback to using index if no ID exists
    const fallbackId = `opp-${index}`;
    console.warn('Using fallback ID:', fallbackId);
    return fallbackId;
  }
  
  // Use just the ID as string (no prefix)
  const dragId = String(id);
  console.log(`✅ Generated drag ID: ${dragId} for opportunity:`, opportunity.opportunityName || opportunity.name);
  return dragId;
};

/**
 * Find opportunity by drag ID
 */
export const findOpportunityByDragId = (opportunities, dragId) => {
  return opportunities.find((opp, index) => {
    const oppDragId = getOpportunityDragId(opp, index);
    return oppDragId === dragId;
  });
};

/**
 * Extract the original opportunity ID from a drag ID
 */
export const extractOpportunityIdFromDragId = (dragId) => {
  // Since we're using the ID directly now, just return it
  // Handle fallback IDs that start with 'opp-'
  if (dragId.startsWith('opp-')) {
    return dragId.replace('opp-', '');
  }
  return dragId;
};