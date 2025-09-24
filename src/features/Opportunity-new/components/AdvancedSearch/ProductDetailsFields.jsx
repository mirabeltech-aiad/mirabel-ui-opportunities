import React, { useState, useEffect } from "react";
import FloatingLabelInput from "../EditOpportunity/FloatingLabelInput";
import FloatingLabelSelect from "../EditOpportunity/FloatingLabelSelect";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { OPPORTUNITY_OPTIONS } from "@OpportunityConstants/opportunityOptions";
import { userService } from "@/features/Opportunity/Services/userService";

const categoryOptions = [
  { value: "networking", label: "Networking" },
  { value: "security", label: "Security" },
  { value: "cloud", label: "Cloud" },
  { value: "analytics", label: "Analytics" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "collaboration", label: "Collaboration" },
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" }
];

const ProductDetailsFields = ({ handleInputChange, handleSelectChange, searchParams = {} }) => {
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [isLoadingBusinessUnits, setIsLoadingBusinessUnits] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const productsList = await userService.getProducts();
        setProducts(productsList);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    const fetchBusinessUnits = async () => {
      try {
        setIsLoadingBusinessUnits(true);
        const units = await userService.getBusinessUnits();
        setBusinessUnits(units);
      } catch (error) {
        console.error('Failed to fetch business units:', error);
        setBusinessUnits([]);
      } finally {
        setIsLoadingBusinessUnits(false);
      }
    };

    fetchProducts();
    fetchBusinessUnits();
  }, []);

  const handleFieldChange = (field) => (value) => {
    handleInputChange({ target: { name: field, value } });
  };

  const handleSelectFieldChange = (field) => (value) => {
    handleSelectChange(field, value);
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Row 1 - Core Product Fields - compact for dropdowns */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="product"
            label="Product"
            value={Array.isArray(searchParams.product) ? searchParams.product : (searchParams.product ? [searchParams.product] : [])}
            onChange={handleSelectFieldChange("product")}
            options={products}
            placeholder={isLoadingProducts ? "Loading products..." : "Select product"}
            disabled={isLoadingProducts}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="business-unit"
            label="Business Unit"
            value={Array.isArray(searchParams.businessUnit) ? searchParams.businessUnit : (searchParams.businessUnit ? [searchParams.businessUnit] : [])}
            onChange={handleSelectFieldChange("businessUnit")}
            options={businessUnits}
            placeholder={isLoadingBusinessUnits ? "Loading business units..." : "Select unit"}
            disabled={isLoadingBusinessUnits}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="product-line"
            label="Product Line"
            value={Array.isArray(searchParams.productLine) ? searchParams.productLine : (searchParams.productLine ? [searchParams.productLine] : [])}
            onChange={handleSelectFieldChange("productLine")}
            options={[{ value: "hardware", label: "Hardware" }, { value: "software", label: "Software" }, { value: "services", label: "Services" }, { value: "consulting", label: "Consulting" }]}
            placeholder="Select line"
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <MultiSelectDropdown
            id="category"
            label="Category"
            value={Array.isArray(searchParams.category) ? searchParams.category : (searchParams.category ? [searchParams.category] : [])}
            onChange={handleSelectFieldChange("category")}
            options={categoryOptions}
            placeholder="Select category"
          />
        </div>
      </div>

      {/* Row 2 - Product Details and Subscription - mixed field types */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 space-y-2">
          <FloatingLabelInput
            id="product-interest"
            label="Product Interest"
            value={searchParams.productInterest || ""}
            onChange={handleFieldChange("productInterest")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelInput
            id="product-id"
            label="Product ID"
            value={searchParams.productId || ""}
            onChange={handleFieldChange("productId")}
          />
        </div>
        <div className="col-span-12 sm:col-span-3 space-y-2">
          <FloatingLabelSelect
            id="subscription-type"
            label="Subscription"
            value={searchParams.subscriptionType || ""}
            onChange={handleSelectFieldChange("subscriptionType")}
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "annual", label: "Annual" },
              { value: "perpetual", label: "Perpetual" }
            ]}
            placeholder="Select type"
          />
        </div>
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="quantity-min"
            label="Qty Min"
            type="number"
            value={searchParams.quantityMin || ""}
            onChange={handleFieldChange("quantityMin")}
          />
        </div>
      </div>

      {/* Row 3 - Quantity Max - single compact field */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-2 space-y-2">
          <FloatingLabelInput
            id="quantity-max"
            label="Qty Max"
            type="number"
            value={searchParams.quantityMax || ""}
            onChange={handleFieldChange("quantityMax")}
          />
        </div>
      </div>

      {/* Row 4 - Pain Points and Notes - full width for text areas */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <Label htmlFor="pain-points" className="text-sm font-medium">Pain Points</Label>
          <Textarea 
            id="pain-points" 
            name="painPoints" 
            placeholder="Enter pain points" 
            onChange={handleInputChange}
            rows={3}
            className="w-full"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            placeholder="Enter notes" 
            onChange={handleInputChange}
            rows={3}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsFields;
