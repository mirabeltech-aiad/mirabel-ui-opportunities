import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Loader2 } from 'lucide-react';
import { getTagColor } from '../helpers/formatters.js';

/**
 * Individual report card component
 * @param {Object} props - Component props
 * @param {Object} props.report - Report object
 * @param {Function} props.onToggleStar - Function to toggle star status
 * @param {boolean} props.isUpdatingStar - Whether star is being updated
 */
const ReportCard = ({ report, onToggleStar, isUpdatingStar = false }) => {
  return (
    <Card className="h-full border border-gray-200 transition-all duration-200 hover:shadow-lg group hover:border-gray-300">
      <CardContent className="p-6">
        {/* Header with Icon and Star */}
        <div className="flex justify-between items-start mb-4">
          <div className="text-2xl">{report.icon}</div>
          <button
            onClick={() => onToggleStar(report.id)}
            disabled={isUpdatingStar}
            className={`text-lg transition-colors ${
              report.isStarred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            } ${isUpdatingStar ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUpdatingStar ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              '★'
            )}
          </button>
        </div>

        {/* Title with Arrow */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
            {report.title}
          </h3>
          <ChevronDown className="h-4 w-4 text-gray-400 ml-2 transform rotate-[-90deg] group-hover:text-gray-600 transition-colors" />
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
          {report.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {report.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.arrayOf(PropTypes.string).isRequired,
    routePath: PropTypes.string.isRequired,
    isStarred: PropTypes.bool.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    usedID: PropTypes.string.isRequired,
    modifiedTitle: PropTypes.string.isRequired
  }).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  isUpdatingStar: PropTypes.bool
};

export default ReportCard;
