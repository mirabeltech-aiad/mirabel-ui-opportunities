import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { getTagColor } from "../helpers/formatters.js";
import { ArrowDown } from "lucide-react";
/**
 * Individual report card component
 * @param {Object} props - Component props
 * @param {Object} props.report - Report object
 * @param {Function} props.onToggleStar - Function to toggle star status
 * @param {boolean} props.isUpdatingStar - Whether star is being updated
 * @param {boolean} props.isDragging - Whether the card is being dragged
 * @param {boolean} props.isReordering - Whether reports are being reordered
 */

export const isWindowTopAccessible = function () {
  try {
    const location = window.top.location.href; // eslint-disable-line no-unused-vars
    return true;
  } catch (e) {
    return false;
  }
};

export const openPage = ({
  nextPage,
  pageTitle,
  addTabAfterActiveTab = false,
  openInSameTab = true
}) => {
  try {
    const topPage = isWindowTopAccessible() ? window.top : null;
    const hasCustomTabHandlers = topPage?.openPageInNextTab !== undefined;

    if (!hasCustomTabHandlers) {
      window.open(nextPage, openInSameTab ? "_self" : "_blank");
      return;
    }

    const openFn = openInSameTab
      ? topPage.openPage
      : topPage.openPageInNextTab;

    return openFn(nextPage, pageTitle, addTabAfterActiveTab);
  } catch (e) {
    console.error("Error opening page:", e);
  }
};


const ReportCard = ({ report, onToggleStar, isUpdatingStar = false, isDragging = false, isReordering = false }) => {
  return (
    <Card className={`h-full border border-gray-200 transition-all duration-200 group hover:shadow-lg hover:border-gray-300 ${isDragging ? 'ring-2 ring-blue-500 shadow-xl' : 'cursor-pointer'} ${isReordering ? 'opacity-75' : ''}`}>
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
              onClick={() => onToggleStar(report)}
              disabled={isUpdatingStar || isReordering}
              className={`text-3xl cursor-pointer transition-colors ${
                report.isStarred
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              } ${(isUpdatingStar || isReordering) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUpdatingStar ? (
                <Spinner size="sm" color="text-yellow-500" inline />
              ) : (
                "★"
              )}
            </button>
            <ArrowDown className="text-gray-400 transform rotate-[-90deg] group-hover:text-gray-600 transition-colors w-6 h-6 cursor-pointer" onClick={() => openPage({ nextPage: report.routePath, pageTitle: report.title })} />
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
  isDragging: PropTypes.bool,
  isReordering: PropTypes.bool,
};

export default ReportCard;
