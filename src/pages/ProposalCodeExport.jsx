
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "@OpportunityComponents/MainNavbar";
import ProposalTableCodeExporter from "../components/CodeExporter/ProposalTableCodeExporter";

const ProposalCodeExport = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden">
      <MainNavbar />
      
      <div className="w-full px-4 py-6 flex-1 overflow-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            onClick={() => navigate('/proposals')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Proposals
          </Button>
          <h1 className="text-2xl font-bold text-[#1a4d80]">Code Export</h1>
        </div>
        
        <ProposalTableCodeExporter />
      </div>
    </div>
  );
};

export default ProposalCodeExport;
