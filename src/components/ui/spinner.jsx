import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Spinner component for loading states
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner
 * @param {string} props.text - Optional text to display below spinner
 * @param {boolean} props.inline - Whether to render as inline element without flex container
 */
const Spinner = ({ 
  className, 
  size = "md", 
  color = "text-primary", 
  text,
  inline = false
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  const spinnerElement = (
    <div
      className={cn(
        "rounded-full border-2 border-gray-300 animate-spin border-t-current",
        sizeClasses[size],
        color
      )}
    />
  );

  if (inline) {
    return spinnerElement;
  }

  return (
    <div className={cn("flex flex-col justify-center items-center", className)}>
      {spinnerElement}
      {text && (
        <span className="mt-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
};

Spinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.string,
  text: PropTypes.string,
  inline: PropTypes.bool
};

export default Spinner; 