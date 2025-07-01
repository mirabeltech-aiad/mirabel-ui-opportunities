
import React from "react";
import BasicSearchFields from "./BasicSearchFields";
import ProposalInfoFields from "./ProposalInfoFields";
import StatusProcessFields from "./StatusProcessFields";
import FinancialDataFields from "./FinancialDataFields";
import ProposalDetailsFields from "./ProposalDetailsFields";
import ClientDetailsFields from "./ClientDetailsFields";
import ContactDetailsFields from "./ContactDetailsFields";
import LocationDetailsFields from "./LocationDetailsFields";
import SearchAccordion from "../AdvancedSearch/SearchAccordion";

const ProposalsAdvancedSearchTabContent = ({
  searchParams,
  handleInputChange,
  handleSelectChange,
  handleSearch,
  openAccordions,
  setOpenAccordions
}) => {
  const accordionItems = [
    {
      value: "primary-fields",
      title: "Quick Search",
      content: (
        <BasicSearchFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "proposal-info",
      title: "Proposal Information",
      content: (
        <ProposalInfoFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "status-process",
      title: "Status & Process",
      content: (
        <StatusProcessFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "financial-commercial",
      title: "Financial & Commercial Terms",
      content: (
        <FinancialDataFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "proposal-details",
      title: "Proposal Details",
      content: (
        <ProposalDetailsFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "client-company",
      title: "Client & Company Information",
      content: (
        <ClientDetailsFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "contact-info",
      title: "Contact Information",
      content: (
        <ContactDetailsFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    },
    {
      value: "geographic-territory",
      title: "Geographic & Territory",
      content: (
        <LocationDetailsFields
          searchParams={searchParams}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      )
    }
  ];

  return (
    <SearchAccordion
      items={accordionItems}
      openAccordions={openAccordions}
      onAccordionChange={setOpenAccordions}
      onSearch={handleSearch}
    />
  );
};

export default ProposalsAdvancedSearchTabContent;
