import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { getTagColor } from "../helpers/formatters.js";
import { ArrowDown } from "lucide-react";
/**
 * Individual report card component
 * @param {Object} props - Component props
 * @param {Object} props.report - Report object
 * @param {Function} props.onToggleStar - Function to toggle star status
 * @param {boolean} props.isUpdatingStar - Whether star is being updated
 */
const ReportCard = ({ report, onToggleStar, isUpdatingStar = false }) => {
  return (
    <Card className="h-full border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-lg group hover:border-gray-300">
      <CardContent className="p-3 sm:p-4">
        {/* Header with Icon and Star */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="text-2xl">{report.icon}</div>
            <h3 className="ml-4 text-lg font-semibold leading-tight text-gray-900 line-clamp-2">
              {report.title}
            </h3>
          </div>
          <div className="flex gap-2 justify-end items-center">
            <button
              onClick={() => onToggleStar(report.id)}
              disabled={isUpdatingStar}
              className={`text-3xl cursor-pointer transition-colors ${
                report.isStarred
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            >
              ★
            </button>
            <ArrowDown className="text-gray-400 transform rotate-[-90deg] group-hover:text-gray-600 transition-colors w-6 h-6 cursor-pointer" />
          </div>
        </div>

        {/* Title with Arrow */}
        <div className="flex justify-between items-center mb-3"></div>

        {/* Description */}
        <div className="flex justify-between">
          <p className="mb-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
            {report.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {report.tags.map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(
                tag
              )}`}
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
    modifiedTitle: PropTypes.string.isRequired,
  }).isRequired,
  onToggleStar: PropTypes.func.isRequired,
  isUpdatingStar: PropTypes.bool,
};

export default ReportCard;
