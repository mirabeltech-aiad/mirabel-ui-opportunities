
// Utility functions for stage trail functionality
export const getStageColor = (stage) => {
  switch (stage) {
    case "Lead":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Qualified":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "1st Demo":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Discovery":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Technical Review":
      return "bg-cyan-100 text-cyan-800 border-cyan-200";
    case "Proposal":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Negotiation":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Closed Won":
      return "bg-green-100 text-green-800 border-green-200";
    case "Closed Lost":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const calculateDaysBetween = (date1, date2) => {
  // Parse dates and normalize to midnight UTC to avoid timezone issues
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set both dates to midnight to ensure we're comparing full days
  d1.setUTCHours(0, 0, 0, 0);
  d2.setUTCHours(0, 0, 0, 0);
  
  // Calculate the difference in milliseconds
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  
  // Convert milliseconds to days (more accurate than ceil)
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};
