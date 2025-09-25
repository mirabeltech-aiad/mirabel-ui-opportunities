/**
 * Clean Kanban utilities for drag and drop operations
 */

/**
 * Attach stable draggable ids to opportunities. Call this once when seeding local state.
 */
export const attachDragIds = (opportunities = []) => {
  return opportunities.map((opp, idx) => {
    const existing = opp._dragId || opp.ID || opp.id;
    const fallbackBase = opp.Name || opp.opportunityName || opp.name || 'item';
    const generated = `tmp-${idx}-${String(fallbackBase).toLowerCase().replace(/\s+/g, '-')}`;
    return {
      ...opp,
      _dragId: String(existing || generated),
    };
  });
};

/**
 * Get consistent opportunity ID for drag and drop operations
 */
export const getDragId = (opportunity, index = 0) => {
  const stamped = opportunity?._dragId;
  if (stamped) return String(stamped);

  const id = opportunity?.ID || opportunity?.id;
  if (!id) {
    // Generate a column-agnostic but stable fallback from index and name
    const fallbackBase = opportunity?.Name || opportunity?.opportunityName || opportunity?.name || 'item';
    return `tmp-${index}-${String(fallbackBase).toLowerCase().replace(/\s+/g, '-')}`;
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
  if (dragId.startsWith('tmp-')) {
    // No numeric id encoded in temp ids; return as-is for UI only flows
    return dragId;
  }
  return dragId;
};