
import React from 'react';
import { 
  StandaloneCard, 
  StandaloneCardContent, 
  StandaloneCardDescription, 
  StandaloneCardHeader, 
  StandaloneCardTitle 
} from './StandaloneCard';
import StandaloneBadge from './StandaloneBadge';
import { FileText, BarChart3, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { getReportKeywordColor } from '@/utils/reportKeywordColors';
import { Report } from '@/data/mockReportsData';

// Simplified hover card components for standalone use
const SimpleHoverCard = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SimpleHoverCardTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

interface StandaloneReportCardProps {
  report: Report;
  onSelect: (reportId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (reportId: string) => void;
}

const StandaloneReportCard = ({ report, onSelect, isFavorite = false, onToggleFavorite }: StandaloneReportCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Subscriber Reports':
        return <FileText className="h-4 w-4" />;
      case 'Performance Reports':
        return <BarChart3 className="h-4 w-4" />;
      case 'Revenue Reports':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(report.id);
    }
  };

  const handleCardClick = () => {
    onSelect(report.id);
  };

  return (
    <StandaloneCard 
      className="cursor-pointer hover:shadow-md transition-all duration-200 h-36 flex flex-col"
      onClick={handleCardClick}
    >
      <StandaloneCardHeader className="pb-1 pt-2 px-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className={report.iconColor}>
              {getCategoryIcon(report.category)}
            </span>
            <StandaloneCardTitle className="text-sm leading-tight font-medium line-clamp-2 text-black">
              {report.title}
            </StandaloneCardTitle>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className="p-1 hover:bg-gray-100 rounded transition-colors z-10"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                type="button"
              >
                <Star 
                  className={`h-3 w-3 transition-colors ${
                    isFavorite 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-400 hover:text-yellow-400'
                  }`} 
                />
              </button>
            )}
            <ArrowRight className="h-3 w-3 text-violet-400" />
          </div>
        </div>
      </StandaloneCardHeader>
      <StandaloneCardContent className="pt-0 px-3 pb-2 flex-1 flex flex-col">
        <StandaloneCardDescription className="text-xs leading-relaxed line-clamp-3 mb-1 text-gray-500 flex-1">
          {report.description}
        </StandaloneCardDescription>
        <div className="flex flex-wrap gap-1 mt-auto">
          {report.keywords.slice(0, 2).map((keyword) => (
            <SimpleHoverCard key={keyword}>
              <SimpleHoverCardTrigger>
                <StandaloneBadge variant="outline" className={`text-xs px-1.5 py-0.5 ${getReportKeywordColor(keyword)}`}>
                  {keyword}
                </StandaloneBadge>
              </SimpleHoverCardTrigger>
            </SimpleHoverCard>
          ))}
          {report.keywords.length > 2 && (
            <SimpleHoverCard>
              <SimpleHoverCardTrigger>
                <StandaloneBadge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 border-gray-200">
                  +{report.keywords.length - 2}
                </StandaloneBadge>
              </SimpleHoverCardTrigger>
            </SimpleHoverCard>
          )}
        </div>
      </StandaloneCardContent>
    </StandaloneCard>
  );
};

export default StandaloneReportCard;
