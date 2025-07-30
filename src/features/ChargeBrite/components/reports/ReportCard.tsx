
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { FileText, BarChart3, TrendingUp, ArrowRight, Star } from 'lucide-react';
import { getKeywordColor } from '@/utils/keywordColors';

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    description: string;
    category: string;
    keywords: string[];
    color: string;
    iconColor: string;
  };
  onSelect: (reportId: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (reportId: string) => void;
}

const ReportCard = ({ report, onSelect, isFavorite = false, onToggleFavorite }: ReportCardProps) => {
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
    <Card 
      size="large"
      className="cursor-pointer hover:shadow-md transition-all duration-200 h-36 flex flex-col bg-white border border-gray-200"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-1 pt-2 px-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className={report.iconColor}>
              {getCategoryIcon(report.category)}
            </span>
            <CardTitle className="text-sm leading-tight font-medium line-clamp-2 text-black">
              {report.title}
            </CardTitle>
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
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-2 flex-1 flex flex-col">
        <CardDescription className="text-xs leading-relaxed line-clamp-3 mb-1 text-gray-500 flex-1">
          {report.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1 mt-auto">
          {report.keywords.slice(0, 2).map((keyword) => (
            <HoverCard key={keyword} openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getKeywordColor(keyword)}`}>
                  {keyword}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Report Tag: {keyword}</h4>
                  <p className="text-sm text-gray-600">
                    This tag indicates that the report contains data and insights related to "{keyword}". 
                    Use these tags to quickly identify reports that match your specific analysis needs.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
          {report.keywords.length > 2 && (
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-700 border-gray-200">
                  +{report.keywords.length - 2}
                </Badge>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Additional Tags</h4>
                  <p className="text-sm text-gray-600">
                    This report contains {report.keywords.length - 2} additional tags: {report.keywords.slice(2).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    These tags help categorize the report's content and make it easier to find relevant data.
                  </p>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
