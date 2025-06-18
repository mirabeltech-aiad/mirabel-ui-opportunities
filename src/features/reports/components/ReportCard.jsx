
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { getTagColor } from '../helpers/formatters.js';

/**
 * Individual report card component
 * @param {Object} props - Component props
 * @param {Object} props.report - Report object
 * @param {Function} props.onToggleStar - Function to toggle star status
 */
const ReportCard = ({ report, onToggleStar }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 group border border-gray-200 hover:border-gray-300">
      <CardContent className="p-6">
        {/* Header with Icon and Star */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-2xl">{report.icon}</div>
          <button
            onClick={() => onToggleStar(report.id)}
            className={`text-lg transition-colors ${
              report.isStarred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            }`}
          >
            ★
          </button>
        </div>

        {/* Title with Arrow */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
            {report.title}
          </h3>
          <ChevronDown className="h-4 w-4 text-gray-400 ml-2 transform rotate-[-90deg] group-hover:text-gray-600 transition-colors" />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
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
  onToggleStar: PropTypes.func.isRequired
};

export default ReportCard;
