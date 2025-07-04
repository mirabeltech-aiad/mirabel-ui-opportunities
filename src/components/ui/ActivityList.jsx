
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pin } from "lucide-react";
import { useInfiniteScroll } from "@/features/Opportunity/hooks/useInfiniteScroll";
import { useScrollObserver } from "@/features/Opportunity/hooks/useScrollObserver";

const ActivityList = ({ activities, pinnedActivities, onPinToggle }) => {
  const [expandedActivities, setExpandedActivities] = useState(new Set());
  const activityRefs = useRef({});

  // Use infinite scroll hook with all activities
  const { displayedItems, hasMore, isLoading, loadMore } = useInfiniteScroll(activities, 10);
  
  // Use scroll observer to trigger loading more items
  const observerRef = useScrollObserver(loadMore, hasMore, isLoading);

  // Basic HTML sanitization to prevent XSS while preserving links and formatting
  const sanitizeHtml = (html) => {
    if (!html) return '';
    
    // Allow basic HTML tags and attributes that are commonly used in the API responses
    // This is a basic approach - in production you might want to use a library like DOMPurify
    const allowedTags = /<\/?(?:a|p|br|div|span|strong|b|em|i|u|ul|ol|li)\b[^>]*>/gi;
    const allowedAttributes = /(?:href|target|class|id)="[^"]*"/gi;
    
    // Remove script tags and event handlers for basic XSS prevention
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '');
  };

  const toggleExpanded = (activityId) => {
    setExpandedActivities(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(activityId)) {
        newExpanded.delete(activityId);
      } else {
        newExpanded.add(activityId);
        // Scroll to the activity after a brief delay to allow for expansion
        setTimeout(() => {
          const activityElement = activityRefs.current[activityId];
          if (activityElement) {
            activityElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
      return newExpanded;
    });
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-3 text-slate-500">
        <p className="text-sm">No activities yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-2">
      <div className="space-y-1">
        {displayedItems.map((activity) => {
          const IconComponent = activity.icon;
          const isPinned = pinnedActivities.has(activity.id);
          const isExpanded = expandedActivities.has(activity.id);
          
          return (
            <div 
              key={activity.id} 
              className="group"
              ref={el => activityRefs.current[activity.id] = el}
            >
              <div className={`flex gap-2 p-1.5 rounded-lg hover:bg-slate-50 transition-colors duration-200 ${isPinned ? 'bg-yellow-50 border border-yellow-200' : ''}`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${activity.color === 'text-orange-600' ? 'bg-orange-100' : activity.color === 'text-blue-600' ? 'bg-blue-100' : activity.color === 'text-green-600' ? 'bg-green-100' : activity.color === 'text-purple-600' ? 'bg-purple-100' : 'bg-red-100'}`}>
                  <IconComponent className={`h-3 w-3 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{activity.user}</span>
                    <span className="text-xs text-slate-500">{activity.date}</span>
                    {isPinned && (
                      <Pin className="h-3 w-3 text-yellow-600 fill-yellow-600" />
                    )}
                  </div>
                  <div 
                    className={`text-sm text-slate-700 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}
                    dangerouslySetInnerHTML={{ 
                      __html: sanitizeHtml(activity.description) 
                    }}
                  />
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Button 
                      variant="link" 
                      className="text-xs p-0 h-auto text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={() => toggleExpanded(activity.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPinToggle(activity.id)}
                      className={`text-xs h-auto p-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isPinned ? 'text-yellow-600' : 'text-slate-400 hover:text-yellow-600'}`}
                      title={isPinned ? 'Unpin activity' : 'Pin activity'}
                    >
                      <Pin className={`h-3 w-3 text-yellow-600 ${isPinned ? 'fill-yellow-600' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Loading indicator and scroll observer */}
        {hasMore && (
          <div ref={observerRef} className="flex justify-center py-4">
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                <span className="text-sm">Loading more activities...</span>
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default ActivityList;
