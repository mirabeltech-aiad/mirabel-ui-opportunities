
// Utility for measuring text width
export const measureTextWidth = (text, fontSize = '14px', fontFamily = 'system-ui, -apple-system, sans-serif') => {
  // Create a temporary canvas element
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Set font properties
  context.font = `${fontSize} ${fontFamily}`;
  
  // Measure the text
  const metrics = context.measureText(text);
  
  // Clean up
  canvas.remove();
  
  return metrics.width;
};

export const calculateOptimalColumnWidths = (columnOrder, opportunities) => {
  const widths = {};
  
  columnOrder.forEach(column => {
    // Measure header text
    const headerWidth = measureTextWidth(column.label, '14px', 'medium system-ui');
    
    // Measure content widths (sample first 10 rows for performance)
    const sampleOpportunities = opportunities.slice(0, 10);
    const contentWidths = sampleOpportunities.map(opp => {
      let content = '';
      
      switch (column.id) {
        case 'status':
        case 'stage':
          content = opp[column.id] || '';
          break;
        case 'name':
        case 'company':
          content = opp[column.id] || '';
          break;
        case 'amount':
          content = `$${(opp.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          break;
        case 'assignedRep':
        case 'createdBy':
          content = opp[column.id] || '';
          break;
        default:
          content = opp[column.id] || '';
      }
      
      return measureTextWidth(content, '14px');
    });
    
    // Get max content width
    const maxContentWidth = Math.max(...contentWidths, 0);
    
    // Use the larger of header or content width, with padding
    const optimalWidth = Math.max(headerWidth, maxContentWidth) + 32; // 32px for padding
    
    // Set minimum and maximum constraints
    const minWidth = 100;
    const maxWidth = 300;
    
    widths[column.id] = Math.max(minWidth, Math.min(maxWidth, optimalWidth));
  });
  
  // Convert to percentages
  const totalWidth = Object.values(widths).reduce((sum, width) => sum + width, 0);
  const percentageWidths = {};
  
  Object.keys(widths).forEach(columnId => {
    percentageWidths[columnId] = (widths[columnId] / totalWidth) * 100;
  });
  
  return percentageWidths;
};
