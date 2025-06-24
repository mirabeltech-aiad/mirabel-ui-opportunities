import React from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReportCard from './ReportCard';

/**
 * A wrapper component that makes the ReportCard sortable.
 * @param {object} props - The component props.
 * @param {object} props.report - The report data.
 * @param {Function} props.onToggleStar - Function to toggle star status
 * @param {boolean} props.isUpdatingStar - Whether star is being updated
 * @param {boolean} props.isReordering - Whether reports are being reordered
 */
const SortableReportCard = ({ report, onToggleStar, isUpdatingStar, isReordering = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ReportCard 
        report={report} 
        onToggleStar={onToggleStar}
        isUpdatingStar={isUpdatingStar}
        isReordering={isReordering}
      />
    </div>
  );
};

SortableReportCard.propTypes = {
  report: PropTypes.object.isRequired,
  onToggleStar: PropTypes.func.isRequired,
  isUpdatingStar: PropTypes.bool,
  isReordering: PropTypes.bool
};

export default SortableReportCard; 