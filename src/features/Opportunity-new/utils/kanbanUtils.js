/**
 * Clean Kanban utilities for drag and drop operations
 */

/**
 * Get consistent opportunity ID for drag and drop operations
 */
export const getDragId = (opportunity, index = 0) => {
  const id = opportunity.ID || opportunity.id;
  
  if (!id) {
    console.warn('No ID found for opportunity, using fallback:', opportunity);
    return `opp-${index}`;
  }
  
  return String(id);
};

/**
 * Find opportunity by drag ID
 */
export const findOpportunityByDragId = (opportunities, dragId) => {
  return opportunities.find((opp, index) => {
    const oppDragId = getDragId(opp, index);
    return oppDragId === dragId;
  });
};

/**
 * Extract the original opportunity ID from a drag ID
 */
export const extractOpportunityIdFromDragId = (dragId) => {
  if (dragId.startsWith('opp-')) {
    return dragId.replace('opp-', '');
  }
  return dragId;
};