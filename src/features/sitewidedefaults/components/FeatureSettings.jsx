import React, { useState, memo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { tabList } from "../helpers/constants.helper";
import { useFeatureSettings } from "../context/Context";

// Settings metadata for headings and descriptions
const settingsMeta = {
  adManagement: [
    {
      key: "IsInstallmentBillingEnabled",
      label: "Allow Installment Billing",
      description:
        "Set up your magazine manager site to allow ad sales to be split up for installment billing.",
    },
    {
      key: "IsMultiplePubsEnabled",
      label: "Allow Multiple Publication Selection",
      description:
        "Set up your magazine manager site for multiple publications to be selected for ad sales and proposals.",
    },
    {
      key: "IsDefaultToGrossRateCardEnabled",
      label: "Default to Gross Rate Card",
      description:
        "Check this box to default new rate cards as being 'Gross' rates, leave unchecked to default to 'Net' rates.",
      enabled: false,
    },
    {
      key: "IsSurchargesEnabled",
      label: "Allow Insertion Surcharges and Discounts",
      description:
        "Allow surcharges and discounts to be created and added to ad sales and proposals.",
    },
    {
      key: "AllowNetAdjustments",
      label: "Allow Net Adjustments",
      description:
        "Allow the user to type in a Net amount, and have the system automatically apply a default charge or discount.",
    },
    {
      key: "AllowProductionCharges",
      label: "Allow Production Charges",
      description:
        "Allow the user to enter Production Charges for Orders and Proposals.",
    },
    {
      key: "IsSharedJobJacketEnabled",
      label: "Shared Job Jacket",
      description: "Allow multiple orders on the same job jacket.",
    },
    {
      key: "IsTextImageEnabled",
      label: "TextImage Tab",
      description:
        "Allow TextImage Changes in JobJacket. Note: This will not affect the invoice or quantity on order. It will just allow to change the text/image in the job jacket.",
    },
    {
      key: "IsESignature",
      label: "eSignature",
      description:
        "Enable electronic signing of documents using RightSignature.",
      enabled: false,
    },
    {
      key: "IsEnableBatchOrderUpdate",
      label: "Batch Update",
      description: "Enable Batch Update.",
      enabled: false,
    },
    {
      key: "IsGroupBuyEnabled",
      label: "Group Buy",
      description: "Enable Group Buy.",
      enabled: false,
    },
    {
      key: "IsSubscriptionEnabled",
      label: "ChargeBrite Subscriptions",
      description: "Enable the ChargeBrite application on your site.",
      enabled: false,
    },
    {
      key: "AllowLevelPricingForMultipleProduct",
      label: "Level Pricing for Multiple Products",
      description:
        "Allow users to enter different rates when adding multiple products to an order buy.",
      enabled: false,
    },
    {
      key: "IsOrderEntryByBusinessUnit",
      label: "Order Entry by Business Unit",
      description:
        "Start the order entry process by selecting a business unit.",
      enabled: false,
    },
    {
      key: "IsProposalPageLinkOppEnabled",
      label: "Add/Link an Opportunity to Proposals",
      description:
        "Display a Button to link a proposal to an existing opportunity or create a new one for the proposal.",
      enabled: false,
    },
    {
      key: "IsProposalPageLinkRequireOppEnabled",
      label: "Require Opportunity for Proposal",
      description:
        "Require an Opportunity to be created or linked in order to save a proposal.",
      enabled: false,
    },
    {
      key: "IsEmergencyBackUpEnabled",
      label: "Emergency Backup",
      description:
        "This feature will enable the Emergency Backup Plan, which uploads data backup files of specific features to destinations such as Google Drive, Dropbox, FTP etc.",
      enabled: false,
    },
    {
      key: "IsInternalApprovalEnabled",
      label: "Enable Internal Approval",
      description: "Set Up Internal Approval Process.",
      enabled: false,
    },
    {
      key: "IsSplitRepChangeOrder",
      label: "Commissioned Rep Change",
      description: "Change Commissioned Rep with Change Order only.",
      enabled: false,
    },
    {
      key: "IsChargebriteMediaOrderEnabled",
      label: "ChargeBrite Media Orders",
      description:
        "Enable the ChargeBrite Media Orders application on your site.",
      enabled: false,
    },
    {
      key: "CaptureCCProfileOnProposalApproval",
      label: "Save Payment Information On Proposal Approval",
      description:
        "Selecting this checkbox will allow customers to store their payment information through a new 'Update Card Details' modal window that opens upon signing and approving the proposal.",
      enabled: false,
    },
    {
      key: "IsMoveContractsEnabled",
      label: "Allow Non-Admins to Move Orders",
      description: "Allow Reps to move Orders from one contact record to another.",
    },
    {
      key: "IsContactReqFieldsEnabled",
      label: "Required Fields during Add Contact",
      description: "Required Fields must be filled in to add a new contact.",
    },
    {
      key: "InvPropCheck",
      label: "Proposal Inventory Warning",
      description: "Show a warning before creating, converting, or copying proposals if inventory limits are exceeded.",
    },
    {
      key: "StopInvPropFail",
      label: "Proposal Stop Processing",
      description: "Prevent proposal creation/copy/convert if inventory limits are exceeded (Admins can override).",
    },
    {
      key: "InvCheck",
      label: "Order Inventory Warning",
      description: "Show a warning before creating, converting, or copying orders if inventory limits are exceeded.",
    },
    {
      key: "StopInvFail",
      label: "Order Stop Processing",
      description: "Prevent order creation/copy/convert if inventory limits are exceeded (Admins can override).",
    },
    {
      key: "IsShowAmountOnInventoryReport",
      label: "Show Amount on Inventory Report",
      description: "Display the amount on the inventory report.",
    },
    {
      key: "RsKey",
      label: "RightSignature API Key",
      description: "API Key for RightSignature integration.",
      input: true,
    },
  ],
  accountReceivable: [
    {
      key: "void_invoices_admin_only",
      label: "Void Invoices - Admin Only",
      description: "Only admin users can unlock and void invoices.",
    },
    {
      key: "consolidate_invoices_by_default",
      label: "Consolidate Invoices by Default",
      description:
        "By default, invoices for a single billing contact will be consolidated into a single invoice during invoice creation. If not selected, there is still an option to consolidate invoices as needed on the invoice creation screen.",
    },
    {
      key: "statements_per_billing_contact",
      label: "Statements Per Billing Contact",
      description:
        "Create statements per billing contact. If selected, pre-payments will NOT show on statements since these cannot be posted per billing contact (only per customer); once prepayments are applied to an invoice, they will show on the statements. If not selected, the statements will be created per customer.",
    },
    {
      key: "allow_magazine_dropdown_in_statement",
      label: "Allow Magazine Drop Down in Statement",
      description:
        "Allow user to Enable/Disable the Magazine Drop Down for Statement Search.",
    },
    {
      key: "email_from_marketing_manager",
      label: "Email from Marketing Manager",
      description:
        "Invoice, Statement and Proposal Emails will be sent via Marketing Manager.",
    },
    {
      key: "allow_invoice_pdf_as_attachment",
      label: "Allow Invoice Pdf as Attachment",
      description:
        "Enable this option to send invoices as PDF attachments via email.",
    },
    {
      key: "finance_charges",
      label: "Finance Charges",
      description:
        "Adding finance charges to the selected invoice will create a separate misc. charge invoice for each selected invoices for the percentage of the total or the amount entered. The original invoices will not be changed. These new finance charge invoices can be seen in customer statements.",
    },
    {
      key: "payment_plans",
      label: "Payment Plans",
      description:
        "Allow users to set up payment plans on this site. This allows the application to create a set of installments for items grouped together on a proposal. These layer over the actual invoices to better control the amounts and dates for receivables and payments. *Note: Can't disable if any Payment Plans exist.",
    },
    {
      key: "enable_schedule_invoices",
      label: "Enable Schedule Invoices",
      description:
        "This feature will enable the option to schedule invoice creation based on the specified criteria.",
    },
    {
      key: "enable_schedule_payments",
      label: "Enable Schedule Payments",
      description:
        "This feature will enable the option to schedule payment creation based on the specified criteria.",
    },
    {
      key: "allow_quickbooks_xero_integration",
      label: "Allow QuickBooks/Xero Integration",
      description: "Enable QuickBooks/Xero integration.",
      render: () => (
        <div className="flex items-center justify-between p-2 border-b">
          {/* Label and description on the left */}
          <div className="flex flex-col w-full md:w-2/3">
            <Label
              className="mb-1 text-base font-semibold"
              htmlFor="allow_quickbooks_xero_integration"
            >
              Allow QuickBooks/Xero Integration
            </Label>
            <p className="text-sm text-muted-foreground">
              Enable QuickBooks/Xero integration.
            </p>
          </div>

          {/* Actions on the right */}
          <div className="flex items-center justify-end w-auto gap-2 md:gap-4">
            {/* Disconnect Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                console.log("Disconnect QuickBooks/Xero clicked");
              }}
            >
              Disconnect QuickBooks/Xero
            </Button>

            {/* Dropdown */}
            <select
              id="quickbooks_xero_dropdown"
              className="px-2 py-1 text-sm border rounded"
              value={true || ""}
              onChange={(e) =>
                handleInput(
                  "accountReceivable",
                  "quickbooksXeroType",
                  e.target.value
                )
              }
            >
              <option value="xero">Xero</option>
              <option value="us_desktop_edition">US Desktop Edition</option>
              <option value="online_edition">Online Edition</option>
              <option value="canadian_online_edition">
                Canadian Online Edition
              </option>
            </select>

            {/* Toggle */}
            <Switch
              id="allow_quickbooks_xero_integration"
              checked={true || false}
              onCheckedChange={() =>
                handleToggle(
                  "accountReceivable",
                  "allow_quickbooks_xero_integration"
                )
              }
            />
          </div>
        </div>
      ),
    },
    {
      key: "enable_multicurrency_to_quickbooks_xero",
      label: "Enable MultiCurrency to QuickBooks/Xero",
      description:
        "This feature will enable Billed Currency Value sending to QuickBooks/Xero Transactions.",
    },
  ],
};

const pickupFromOptions = [
  { value: "ProductName", label: "Product Name" },
  { value: "IssueName", label: "Issue Name" },
  { value: "IssueYear", label: "Issue Year" },
  { value: "AdSize", label: "Ad Size" },
  { value: "AdName", label: "Ad Name" },
  // Add more as needed
];

const separatorOptions = [
  { value: '', label: '' },
  { value: "' '", label: ' ' },
  { value: "':'", label: ':' },
  { value: "','", label: ',' },
  { value: "'-'", label: '-' },
];

const pickupOptions = [
  { Key: '', Description: '', Script: "''" },
  { Key: 'ProductName', Description: 'Product Name', Script: "ISNULL(gsPublications.PubName,'')" },
  { Key: 'Description', Description: 'Description', Script: "ISNULL(gsContracts.Description,'')" },
  { Key: 'IssueName', Description: 'Issue Name', Script: "ISNULL(tblMagFrequency.IssueName,'')" },
  { Key: 'IssueYear', Description: 'Issue Year', Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueYear),'')" },
  { Key: 'IssueDate', Description: 'Issue Date', Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueDate,101),'')" },
  { Key: 'AdSize', Description: 'Ad Size', Script: "ISNULL(gsAdSize.AdSizeName,'')" },
  { Key: 'Frequency', Description: 'Frequency', Script: "ISNULL(gsContracts.Frequency,'')" },
  { Key: 'Color', Description: 'Color', Script: "ISNULL(gsContracts.Color,'')" },
  { Key: 'Position', Description: 'Position', Script: "ISNULL(gsContracts.PosReq1,'')" },
  { Key: 'Section', Description: 'Section', Script: "ISNULL(gsPubSections.SectionName,'')" },
  { Key: 'AdName', Description: 'Ad Name', Script: "ISNULL(gsContracts.AdName,'')" },
];

function PickupFromSection({ pickupState = {}, handlePickupInput }) {
  const [pickupOptions, setPickupOptions] = useState([
    { Key: "", Description: "", Script: "''" },
    { Key: "ProductName", Description: "Product Name", Script: "ISNULL(gsPublications.PubName,'')" },
    { Key: "Description", Description: "Description", Script: "ISNULL(gsContracts.Description,'')" },
    { Key: "IssueName", Description: "Issue Name", Script: "ISNULL(tblMagFrequency.IssueName,'')" },
    { Key: "IssueYear", Description: "Issue Year", Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueYear),'')" },
    { Key: "IssueDate", Description: "Issue Date", Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueDate,101),'')" },
    { Key: "AdSize", Description: "Ad Size", Script: "ISNULL(gsAdSize.AdSizeName,'')" },
    { Key: "Frequency", Description: "Frequency", Script: "ISNULL(gsContracts.Frequency,'')" },
    { Key: "Color", Description: "Color", Script: "ISNULL(gsContracts.Color,'')" },
    { Key: "Position", Description: "Position", Script: "ISNULL(gsContracts.PosReq1,'')" },
    { Key: "Section", Description: "Section", Script: "ISNULL(gsPubSections.SectionName,'')" },
    { Key: "AdName", Description: "Ad Name", Script: "ISNULL(gsContracts.AdName,'')" },
  ]);

  const pickupKeys = [
    "PickupFrom1",
    "PickupFrom2",
    "PickupFrom3",
    "PickupFrom4",
    "PickupFrom5",
  ];
  const separatorKeys = [
    "PickupFromTextSeparator1",
    "PickupFromTextSeparator2",
    "PickupFromTextSeparator3",
    "PickupFromTextSeparator4",
  ];

  const handlePickupFromChange = (fieldKey, value) => {
    const otherValues = pickupKeys.filter(k => k !== fieldKey).map(k => pickupState[k]);
    if (value !== "''" && otherValues.includes(value)) {
      window.alert("This field is already used in another dropdown.");
      handlePickupInput(fieldKey, "''");
      return;
    }
    handlePickupInput(fieldKey, value);
  };

  return (
    <div className="mt-6 mb-2">
      <Label className="font-semibold text-base block mb-1">
        'Pickup From' Description
      </Label>
      <div className="text-sm text-muted-foreground mb-3">
        Choose the data to display in the 'Pickup From' drop down lists and reports in order to give users the information they need to choose or view the correct insertion to pick up
      </div>
      <div className="flex flex-col gap-2">
        {/* First field (no separator) */}
        <select
          className="border rounded px-2 py-0.5 h-8 text-sm min-w-[140px]"
          value={(pickupState && pickupState.PickupFrom1) || "''"}
          onChange={e => handlePickupFromChange("PickupFrom1", e.target.value)}
        >
          {pickupOptions.map(opt => (
            <option key={opt.Script} value={opt.Script}>{opt.Description}</option>
          ))}
        </select>
        {/* Remaining fields with separators */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-row gap-2 items-center">
            <select
              className="border rounded px-2 py-0.5 h-8 text-sm w-12"
              value={(pickupState && pickupState[separatorKeys[i - 1]]) || ''}
              onChange={e => handlePickupInput(separatorKeys[i - 1], e.target.value)}
            >
              {separatorOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-0.5 h-8 text-sm min-w-[140px]"
              value={(pickupState && pickupState[pickupKeys[i]]) || "''"}
              onChange={e => handlePickupFromChange(pickupKeys[i], e.target.value)}
            >
              {pickupOptions.map(opt => (
                <option key={opt.Script} value={opt.Script}>{opt.Description}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardDemoPage() {
  const {
    state,
    handleToggle,
    handleInput,
    setNewSupplier,
    handleAddSupplier,
    handleRemoveSupplier,
    updateInventory,
    isLoading: apiLoading,
    error: apiError,
  } = useFeatureSettings();
  const [tabWindow, setTabWindow] = useState([0, 5]);
  const [activeTab, setActiveTab] = useState("adManagement");

  const handlePrevTabs = () => {
    setTabWindow([tabWindow[0] - 1, tabWindow[1] - 1]);
  };

  const handleNextTabs = () => {
    setTabWindow([tabWindow[0] + 1, tabWindow[1] + 1]);
  };

  return (
    <div className="px-4 py-2 mx-auto">
      <div className="sticky top-0 z-20 pb-2 bg-background">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevTabs}
              disabled={tabWindow[0] === 0}
              className="w-8 h-8"
              aria-label="Previous Tabs"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <TabsList className="flex flex-wrap gap-2 grow">
              {tabList.slice(tabWindow[0], tabWindow[1]).map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextTabs}
              disabled={tabWindow[1] >= tabList.length}
              className="w-8 h-8"
              aria-label="Next Tabs"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <TabsContent value="storeSupply" className="p-0">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Inventory Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiLoading ? (
                    <div>Loading inventory settings...</div>
                  ) : apiError ? (
                    <div>
                      Error loading inventory settings: {apiError.message}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="track-inventory">Track Inventory</Label>
                        <Switch
                          id="track-inventory"
                          checked={state.storeSupply?.trackInventory || false}
                          onCheckedChange={() =>
                            updateInventory({
                              trackInventory: !state.storeSupply?.trackInventory,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="low-stock-alert">Low Stock Alerts</Label>
                        <Switch
                          id="low-stock-alert"
                          checked={state.storeSupply?.lowStockAlert || false}
                          onCheckedChange={() =>
                            updateInventory({
                              lowStockAlert: !state.storeSupply?.lowStockAlert,
                            })
                          }
                          disabled={!state.storeSupply?.trackInventory}
                        />
                      </div>

                      {state.storeSupply?.lowStockAlert && (
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="threshold">Low Stock Threshold</Label>
                          <Input
                            id="threshold"
                            type="number"
                            value={state.storeSupply?.lowStockThreshold || 5}
                            onChange={(e) =>
                              updateInventory({
                                lowStockThreshold: Number(e.target.value),
                              })
                            }
                            min={1}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-reorder">Auto Reorder</Label>
                        <Switch
                          id="auto-reorder"
                          checked={state.storeSupply?.autoReorder || false}
                          onCheckedChange={() =>
                            updateInventory({
                              autoReorder: !state.storeSupply?.autoReorder,
                            })
                          }
                          disabled={!state.storeSupply?.trackInventory}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Supplier Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {apiLoading ? (
                    <div>Loading supplier settings...</div>
                  ) : apiError ? (
                    <div>
                      Error loading supplier settings: {apiError.message}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="new-supplier">Add Preferred Supplier</Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-supplier"
                            value={state.newSupplier || ""}
                            onChange={(e) => setNewSupplier(e.target.value)}
                            placeholder="Enter supplier name"
                          />
                          <Button onClick={handleAddSupplier}>Add</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Suppliers</Label>
                        {!state.storeSupply?.preferredSuppliers?.length ? (
                          <p className="text-sm text-muted-foreground">
                            No preferred suppliers added yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {state.storeSupply?.preferredSuppliers?.map(
                              (supplier, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <span>{supplier}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSupplier(supplier)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Tabs value={activeTab} className="w-full">
        {/* Ad Management Tab */}
        <TabsContent value="adManagement" className="w-11/12 m-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ad - Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {settingsMeta.adManagement.map((item, idx) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-2 ${
                    idx !== settingsMeta.adManagement.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <Label
                      className="mb-1 text-base font-semibold"
                      htmlFor={item.key}
                    >
                      {item.label}
                    </Label>
                    <p className="text-sm text-left text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  {item.input ? (
                    <Input
                      id={item.key}
                      value={state[item.key] || ""}
                      onChange={e => handleInput(item.key, e.target.value)}
                      className="w-64"
                    />
                  ) : (
                    <Switch
                      id={item.key}
                      checked={!!state[item.key]}
                      onCheckedChange={() => handleToggle(item.key)}
                    />
                  )}
                </div>
              ))}
              <div className="flex flex-col p-2 border-b">
                <Label className="mb-1 text-base font-semibold" htmlFor="LoggedInRepChoiceProposal">
                  Default Sales Rep for Item Entry
                </Label>
                <div className="flex flex-row items-center gap-4 flex-wrap">
                  <div className="flex flex-row items-center min-w-[420px]">
                    <select
                      id="LoggedInRepChoiceProposal"
                      className="border rounded px-2 py-1 mr-2"
                      value={state.LoggedInRepChoiceProposal === false ? "false" : "true"}
                      onChange={e => handleInput("LoggedInRepChoiceProposal", e.target.value === "true")}
                    >
                      <option value="true">Logged in Rep</option>
                      <option value="false">Rep on Client Account</option>
                    </select>
                    <span className="text-sm text-muted-foreground ml-2">
                      for the default sales rep that is assigned to a new item on <b>proposals</b>.
                    </span>
                  </div>
                  <div className="flex flex-row items-center min-w-[420px] mt-2 md:mt-0">
                    <select
                      id="LoggedInRepChoice"
                      className="border rounded px-2 py-1 mr-2"
                      value={state.LoggedInRepChoice === false ? "false" : "true"}
                      onChange={e => handleInput("LoggedInRepChoice", e.target.value === "true")}
                    >
                      <option value="true">Logged in Rep</option>
                      <option value="false">Rep on Client Account</option>
                    </select>
                    <span className="text-sm text-muted-foreground ml-2">
                      for the default sales rep that is assigned to a new item on <b>order</b>.
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Show Additional Insertion Years"}
                  >
                    Show Additional Insertion Years
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    When adding and/or editing insertions, show{" "}
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={state.IssueYearCheckBoxEnd || 12}
                      onChange={(e) =>
                        handleInput("IssueYearCheckBoxEnd", parseInt(e.target.value, 10))
                      }
                    />{" "}
                    years of issues starting with the year{" "}
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={state.IssueYearCheckBoxStart || -1}
                      onChange={(e) =>
                        handleInput("IssueYearCheckBoxStart", parseInt(e.target.value, 10))
                      }
                    />{" "}
                    (use -1 for the current year)
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Don't Allow Proposals for Customers Over their Credit Limit"}
                  >
                    Don't Allow Proposals for Customers Over their Credit Limit
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    Do not allow proposals to be created for clients that have
                    an unpaid balance more than
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={state.CheckCreditLimitOnProposeDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "CheckCreditLimitOnProposeDays",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit. The credit
                    limit is set on the "Details" page of a contact
                  </div>
                </div>
                <Switch
                  checked={state.CheckCreditLimitOnPropose || false}
                  onCheckedChange={() =>
                    handleToggle(
                      "CheckCreditLimitOnPropose"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Don't Allow Orders for Customers Over their Credit Limit"}
                  >
                    Don't Allow Orders for Customers Over their Credit Limit
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    {" "}
                    Do not allow orders/insertions to be added into the system
                    for clients that have an unpaid balance more than
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={state.CheckCreditLimitOnAddDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "CheckCreditLimitOnAddDays",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit. The credit
                    limit is set on the "Details" page of a contact.
                  </div>
                </div>
                <Switch
                  checked={state.CheckCreditLimitOnAdd || false}
                  onCheckedChange={() =>
                    handleToggle(
                      "CheckCreditLimitOnAdd"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Display Credit Limit on Runsheet"}
                  >
                    Display Credit Limit on Runsheet
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    Clients that have an unpaid balance more than{" "}
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={state.CheckCreditLimitOnRunsheetDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "CheckCreditLimitOnRunsheetDays",
                          parseInt(e.target.value, 10)
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit will be
                    displayed in red on the "Sales Runsheet" report.
                  </div>
                </div>
                <Switch
                   id="CheckCreditLimitOnRunsheet"
                   checked={state.CheckCreditLimitOnRunsheet || false}
                   onCheckedChange={() => handleToggle("CheckCreditLimitOnRunsheet")}
                />
              </div>
              <div className="flex items-center justify-between p-2">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Check Inventory"}
                  >
                    Check Inventory{" "}
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Check items against entered inventory limits when adding new
                    items, editing existing items, converting proposals to
                    orders or copying existing orders. Inventory limits are set
                    by product/issue/adsize or product/adsize for products with
                    no issues (i.e. digital only).
                  </p>
                  <br />

                  <p className="text-sm text-left text-muted-foreground">
                    If "Warning" is selected, a window with a warning will show
                    before any new items are created, converted or copied;
                    showing a summary of the inventory numbers with a link to
                    the inventory report and a button to proceed with the entry
                    despite the warning.
                  </p>
                  <br />

                  <p className="text-sm text-left text-muted-foreground">
                    If "Stop" is selected, the button to "Proceed" with the
                    entry will not be available and the item cannot be
                    created/copied/converted/etc. *Admin users can still add
                    items even if they "Stop Processing" option is checked.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row border-b p-2">
                {/* Proposal Items */}
                <div className="border rounded p-3 flex-1 min-w-[220px]">
                  <div className="mb-2 font-semibold text-center">
                    Proposal Items
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="proposalInventoryWarning"
                        checked={true || false}
                        onCheckedChange={() =>
                          handleToggle(
                            "adManagement",
                            "proposalInventoryWarning"
                          )
                        }
                      />
                      <Label htmlFor="proposalInventoryWarning">
                        Inventory Warning
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="proposalStopProcessing"
                        checked={true || false}
                        onCheckedChange={() =>
                          handleToggle("adManagement", "proposalStopProcessing")
                        }
                      />
                      <Label htmlFor="proposalStopProcessing">
                        Stop Processing
                      </Label>
                    </div>
                  </div>
                </div>
                {/* Orders */}
                <div className="border rounded p-3 flex-1 min-w-[220px]">
                  <div className="mb-2 font-semibold text-center">Orders</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="orderInventoryWarning"
                        checked={true || false}
                        onCheckedChange={() =>
                          handleToggle("adManagement", "orderInventoryWarning")
                        }
                      />
                      <Label htmlFor="orderInventoryWarning">
                        Inventory Warning
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="orderStopProcessing"
                        checked={true || false}
                        onCheckedChange={() =>
                          handleToggle("adManagement", "orderStopProcessing")
                        }
                      />
                      <Label htmlFor="orderStopProcessing">
                        Stop Processing
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <PickupFromSection
                pickupState={state.PickupFromSettings || {}}
                handlePickupInput={(key, value) => handleInput('PickupFromSettings', { ...state.PickupFromSettings, [key]: value })}
              />
            </CardContent>
          </Card>
        </TabsContent>
        {/* Account Tab */}

        {/* Account Receivable Settings */}
        <TabsContent value="accountReceivable" className="w-11/12 m-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Receivable Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* First item with input box */}
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor="barter_trade_display_name"
                  >
                    Barter/Trade Display Name
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Use the word{" "}
                    <Input
                      id="barter_trade_display_name"
                      value={true || ""}
                      onChange={(e) =>
                        handleInput(
                          "accountReceivable",
                          "barterTradeDisplayName",
                          e.target.value
                        )
                      }
                      placeholder="Trade"
                      className="inline-block w-24 mx-1"
                    />{" "}
                    on invoices and statements to signify barter/trade.
                  </p>
                </div>
              </div>

              {/* Remaining toggles */}
              {[]?.map((item, idx) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-2 ${
                    idx !== 11 ? "border-b" : ""
                  }`}
                >
                  {item.render ? (
                    item.render()
                  ) : (
                    <>
                      <div className="flex flex-col items-start">
                        <Label
                          className="mb-1 text-base font-semibold"
                          htmlFor={item.key}
                        >
                          {item.label}
                        </Label>
                        <p className="text-sm text-left text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch
                        id={item.key}
                        checked={state[item.key] || false}
                        onCheckedChange={() => handleToggle(item.key)}
                      />
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Production Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="mb-1 text-base font-semibold">
                    Indesign + Digital Studio Plugin Access
                  </Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Download the Latest Version of the Plugin
                  </a>
                </div>
                <Switch
                  checked={state.digitalStudio || false}
                  onCheckedChange={() => handleToggle('digitalStudio')}
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="mb-1 text-base font-semibold">
                    Default File Names
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Rename production file uploads using this pattern
                    [Company~Product~Issue Name or Start Date~Production
                    ID~Stage_Count]
                  </p>
                </div>
                <Switch
                  checked={state.enableProject || false}
                  onCheckedChange={() => handleToggle('enableProject')}
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label className="mb-1 text-base font-semibold">
                    Indesign Plugin for Single Ad Indesign
                  </Label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Download the Latest Version of the Plugin
                  </a>
                </div>
                <Switch
                  checked={state.digitalStudio || false}
                  onCheckedChange={() => handleToggle('digitalStudio')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Circulation Settings */}
        <TabsContent value="circulationSettings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Circulation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 border-b">
                {/* Label and description on the left */}
                <div className="flex flex-col w-full md:w-2/3">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor="allow_quickbooks_xero_integration"
                  >
                    Default Subscription Type
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    as the default subscription type for new subscriptions.
                  </p>
                </div>

                {/* Actions on the right */}
                <div className="flex items-center justify-end w-auto gap-2 md:gap-4">
                  {/* Dropdown */}
                  <select
                    id="quickbooks_xero_dropdown"
                    className="px-2 py-1 text-sm border rounded"
                    value={true || ""}
                    onChange={(e) =>
                      handleInput(
                        "accountReceivable",
                        "quickbooksXeroType",
                        e.target.value
                      )
                    }
                  >
                    <option value="xero">Free/Comp List</option>
                    <option value="us_desktop_edition">Free/Non Res</option>
                    <option value="online_edition">Online Edition</option>
                    <option value="canadian_online_edition">
                      Canadian Online Edition
                    </option>
                  </select>

                  {/* Toggle */}
                  <Switch
                    id="allow_quickbooks_xero_integration"
                    checked={true || false}
                    onCheckedChange={() =>
                      handleToggle(
                        "accountReceivable",
                        "allow_quickbooks_xero_integration"
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Management Tab */}
        <TabsContent value="contact">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Allow Job # Edit</Label>
                <Switch
                  checked={state.allowJobEdit || false}
                  onCheckedChange={() => handleToggle('allowJobEdit')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Call Disposition</Label>
                <Switch
                  checked={state.callDisposition || false}
                  onCheckedChange={() => handleToggle('callDisposition')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Display Report</Label>
                <Switch
                  checked={state.displayReport || false}
                  onCheckedChange={() => handleToggle('displayReport')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Primary Contact Switch</Label>
                <Switch
                  checked={state.primaryContactSwitch || false}
                  onCheckedChange={() => handleToggle('primaryContactSwitch')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Billing Contact</Label>
                <Switch
                  checked={state.billingContact || false}
                  onCheckedChange={() => handleToggle('billingContact')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Cloud Communications</Label>
                <Switch
                  checked={state.enableCloud || false}
                  onCheckedChange={() => handleToggle('enableCloud')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Portal Tab */}
        <TabsContent value="customerPortal">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                {" "}
                <Label>Enable Customer Portal</Label>{" "}
                <Switch
                  id="customerPortal-enable"
                  checked={state.enable || false}
                  onCheckedChange={() => handleToggle("enable")}
                />{" "}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings Tab */}
        <TabsContent value="userSettings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Restrict Customer Search</Label>
                <Switch
                  checked={state.restrictCustomerSearch || false}
                  onCheckedChange={() => handleToggle('restrictCustomerSearch')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Calendar Access</Label>
                <Switch
                  checked={state.restrictCalendar || false}
                  onCheckedChange={() => handleToggle('restrictCalendar')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Product Access</Label>
                <Switch
                  checked={state.restrictProduct || false}
                  onCheckedChange={() => handleToggle('restrictProduct')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Email Capture</Label>
                <Switch
                  checked={state.enableEmailCapture || false}
                  onCheckedChange={() => handleToggle('enableEmailCapture')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Summary Email Notifications</Label>
                <Switch
                  checked={state.summaryEmail || false}
                  onCheckedChange={() => handleToggle('summaryEmail')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Marketing Manager Notifications</Label>
                <Switch
                  checked={state.marketingManager || false}
                  onCheckedChange={() => handleToggle('marketingManager')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Rep Notifications</Label>
                <Switch
                  checked={state.repNotifications || false}
                  onCheckedChange={() => handleToggle('repNotifications')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Communications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Campaign</Label>
                <Switch
                  checked={state.campaign || false}
                  onCheckedChange={() => handleToggle('campaign')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailing Manager</Label>
                <Switch
                  checked={state.mailingManager || false}
                  onCheckedChange={() => handleToggle('mailingManager')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailer</Label>
                <Switch
                  checked={state.mailer || false}
                  onCheckedChange={() => handleToggle('mailer')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch
                  checked={state.enableHelpdesk || false}
                  onCheckedChange={() => handleToggle('enableHelpdesk')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Google Calendar Tab */}
        <TabsContent value="googleCalendar">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Google Calendar</Label>
                <Switch
                  checked={state.googleCalendar || false}
                  onCheckedChange={() => handleToggle('googleCalendar')}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={state.googleCalendarApiKey || ""}
                  onChange={(e) =>
                    handleInput("googleCalendar", "apiKey", e.target.value)
                  }
                  placeholder="Enter your Google Calendar API Key"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Helpdesk Tab */}
        <TabsContent value="helpdesk">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Helpdesk Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch
                  checked={state.helpdesk || false}
                  onCheckedChange={() => handleToggle('helpdesk')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media MailKit Tab */}
        <TabsContent value="mediaMailKit">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Media MailKit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Send Lead as HTML</Label>
                <Switch
                  checked={state.mediaMailKitSendLead || false}
                  onCheckedChange={() => handleToggle('mediaMailKitSendLead')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Ad as HTML</Label>
                <Switch
                  checked={state.mediaMailKitSendAd || false}
                  onCheckedChange={() => handleToggle('mediaMailKitSendAd')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Email as HTML</Label>
                <Switch
                  checked={state.mediaMailKitSendEmail || false}
                  onCheckedChange={() => handleToggle('mediaMailKitSendEmail')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Media MailKit</Label>
                <Switch
                  checked={state.mediaMailKitEnableKit || false}
                  onCheckedChange={() => handleToggle('mediaMailKitEnableKit')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}

// Wrap component with memo to prevent unnecessary renders
export default memo(DashboardDemoPage);
