
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/features/Opportunity/Services/apiService";

const CallDispositionSelect = ({ value, onChange, className = "" }) => {
  // Fetch call disposition options from the API
  const { data: dispositionData, isLoading: dispositionLoading } = useQuery({
    queryKey: ['callDispositions'],
    queryFn: async () => {
      const response = await apiService.get('/services/Admin/Masters/MasterData/CallDisposition');
      return response.content?.Data?.CallDisposition || [];
    }
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Call Disposition" />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
        {dispositionLoading ? (
          <SelectItem value="loading" disabled>Loading...</SelectItem>
        ) : (
          dispositionData?.map((disposition) => (
            <SelectItem key={disposition.Value} value={disposition.Value.toString()}>
              {disposition.Display}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};

export default CallDispositionSelect;
