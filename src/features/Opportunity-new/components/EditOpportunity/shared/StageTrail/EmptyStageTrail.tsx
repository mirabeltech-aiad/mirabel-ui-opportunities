import React from "react";
import { Calendar } from "lucide-react";

const EmptyStageTrail: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p>No stage changes found.</p>
      <p className="text-sm">Stage progression will appear here as the opportunity advances.</p>
    </div>
  );
};

export default EmptyStageTrail;