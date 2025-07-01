
import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "../EditOpportunity/FloatingLabelSelect";
import { userService } from "@/services/userService";

const BasicSearchFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [opportunityCreators, setOpportunityCreators] = useState([]);
  const [isLoadingCreators, setIsLoadingCreators] = useState(true);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [isLoadingBusinessUnits, setIsLoadingBusinessUnits] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [assignedReps, setAssignedReps] = useState([]);
  const [isLoadingAssignedReps, setIsLoadingAssignedReps] = useState(true);
  const [salesPresenters, setSalesPresenters] = useState([]);
  const [isLoadingSalesPresenters, setIsLoadingSalesPresenters] = useState(true);

  useEffect(() => {
    const fetchOpportunityCreators = async () => {
      try {
        setIsLoadingCreators(true);
        const creators = await userService.getOpportunityCreators();
        setOpportunityCreators(creators);
      } catch (error) {
        console.error('Failed to fetch opportunity creators:', error);
        // Set empty array on error
        setOpportunityCreators([]);
      } finally {
        setIsLoadingCreators(false);
      }
    };

    const fetchBusinessUnits = async () => {
      try {
        setIsLoadingBusinessUnits(true);
        const units = await userService.getBusinessUnits();
        setBusinessUnits(units);
      } catch (error) {
        console.error('Failed to fetch business units:', error);
        // Set empty array on error
        setBusinessUnits([]);
      } finally {
        setIsLoadingBusinessUnits(false);
      }
    };

    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const productsList = await userService.getProducts();
        setProducts(productsList);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Set empty array on error
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const fetchCampaigns = async () => {
      try {
        setIsLoadingCampaigns(true);
        const campaignsList = await userService.getCampaigns();
        setCampaigns(campaignsList);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
        // Set empty array on error
        setCampaigns([]);
      } finally {
        setIsLoadingCampaigns(false);
      }
    };

    const fetchAssignedReps = async () => {
      try {
        setIsLoadingAssignedReps(true);
        const reps = await userService.getOpportunityCreators();
        setAssignedReps(reps);
      } catch (error) {
        console.error('Failed to fetch assigned reps:', error);
        // Set empty array on error
        setAssignedReps([]);
      } finally {
        setIsLoadingAssignedReps(false);
      }
    };

    const fetchSalesPresenters = async () => {
      try {
        setIsLoadingSalesPresenters(true);
        const presenters = await userService.getOpportunityCreators();
        setSalesPresenters(presenters);
      } catch (error) {
        console.error('Failed to fetch sales presenters:', error);
        // Set empty array on error
        setSalesPresenters([]);
      } finally {
        setIsLoadingSalesPresenters(false);
      }
    };

    fetchOpportunityCreators();
    fetchBusinessUnits();
    fetchProducts();
    fetchCampaigns();
    fetchAssignedReps();
    fetchSalesPresenters();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  const opportunityNameOptions = [
    { value: "IN=Is Empty~", label: "Is Empty" },
    { value: "INN=Is Not Empty~", label: "Not Empty" }
  ];

  return (
    <div className="pt-2">
      <div className="space-y-3">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-5 space-y-2">
            <FloatingLabelSelect
              id="opportunity-name-basic"
              label="Opportunity Name"
              value={searchParams.opportunityNameBasic || ""}
              onChange={handleSelectFieldChange("opportunityNameBasic")}
              options={opportunityNameOptions}
              placeholder="Select option"
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <FloatingLabelSelect
              id="created-rep"
              label="Opportunity Creator"
              value={searchParams.createdRep || ""}
              onChange={handleSelectFieldChange("createdRep")}
              options={opportunityCreators}
              placeholder={isLoadingCreators ? "Loading creators..." : "Select creator"}
              disabled={isLoadingCreators}
            />
          </div>
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <FloatingLabelSelect
              id="business-unit"
              label="Business Unit"
              value={searchParams.businessUnit || ""}
              onChange={handleSelectFieldChange("businessUnit")}
              options={businessUnits}
              placeholder={isLoadingBusinessUnits ? "Loading business units..." : "Select business unit"}
              disabled={isLoadingBusinessUnits}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-3 space-y-2">
            <FloatingLabelSelect
              id="product"
              label="Product"
              value={searchParams.product || ""}
              onChange={handleSelectFieldChange("product")}
              options={products}
              placeholder={isLoadingProducts ? "Loading products..." : "Select product"}
              disabled={isLoadingProducts}
            />
          </div>
          <div className="col-span-12 sm:col-span-5 space-y-2">
            <FloatingLabelInput
              id="company-name-basic"
              label="Company Name"
              value={searchParams.companyNameBasic || ""}
              onChange={handleFieldChange("companyNameBasic")}
            />
          </div>
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <FloatingLabelSelect
              id="sales-presenter"
              label="Sales Presenter"
              value={searchParams.salesPresenter || ""}
              onChange={handleSelectFieldChange("salesPresenter")}
              options={salesPresenters}
              placeholder={isLoadingSalesPresenters ? "Loading presenters..." : "Select presenter"}
              disabled={isLoadingSalesPresenters}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 sm:col-span-4 space-y-2">
            <FloatingLabelSelect
              id="assigned-rep"
              label="Assigned Rep"
              value={searchParams.assignedRep || ""}
              onChange={handleSelectFieldChange("assignedRep")}
              options={assignedReps}
              placeholder={isLoadingAssignedReps ? "Loading reps..." : "Select rep"}
              disabled={isLoadingAssignedReps}
            />
          </div>
          <div className="col-span-12 sm:col-span-5 space-y-2">
            <FloatingLabelSelect
              id="primary-campaign"
              label="Primary Campaign Source"
              value={searchParams.primaryCampaign || ""}
              onChange={handleSelectFieldChange("primaryCampaign")}
              options={campaigns}
              placeholder={isLoadingCampaigns ? "Loading campaigns..." : "Select campaign"}
              disabled={isLoadingCampaigns}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicSearchFields;
