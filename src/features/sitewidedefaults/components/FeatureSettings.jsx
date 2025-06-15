import React, { useState, memo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tabList } from "../helpers/constants.helper";
import { useFeatureSettings } from "../context/Context";
import { useCirculationTypes } from "../hooks/useCirculationTypes";
import { AdManagement } from "./AdManagement";
import { AccountReceivable } from "./AccountReceivable";
import { Production } from "./Production";
import { CirculationSettings } from "./CirculationSettings";
import { ContactManagement } from "./ContactManagement";
import { CustomerPortal } from "./CustomerPortal";
import { UserSettings } from "./UserSettings";
import { Communications } from "./Communications";
import { GoogleCalendar } from "./GoogleCalendar";
import { MarketingManagerPackage } from "./MarketingManagerPackage";
import { Helpdesk } from "./Helpdesk";
import { MediaMateAI } from "./MediaMateAI";
import { EmailSettings } from "./EmailSettings";

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
      description:
        "Allow Reps to move Orders from one contact record to another.",
    },
    {
      key: "IsContactReqFieldsEnabled",
      label: "Required Fields during Add Contact",
      description: "Required Fields must be filled in to add a new contact.",
    },
    {
      key: "InvPropCheck",
      label: "Proposal Inventory Warning",
      description:
        "Show a warning before creating, converting, or copying proposals if inventory limits are exceeded.",
    },
    {
      key: "StopInvPropFail",
      label: "Proposal Stop Processing",
      description:
        "Prevent proposal creation/copy/convert if inventory limits are exceeded (Admins can override).",
    },
    {
      key: "InvCheck",
      label: "Order Inventory Warning",
      description:
        "Show a warning before creating, converting, or copying orders if inventory limits are exceeded.",
    },
    {
      key: "StopInvFail",
      label: "Order Stop Processing",
      description:
        "Prevent order creation/copy/convert if inventory limits are exceeded (Admins can override).",
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
      key: "InvoiceVoidAdminOnly",
      label: "Void Invoices - Admin Only",
      description: "Only admin users can unlock and void invoices.",
    },
    {
      key: "CInvoiceByDefault",
      label: "Consolidate Invoices by Default",
      description:
        "By default, invoices for a single billing contact will be consolidated into a single invoice during invoice creation. If not selected, there is still an option to consolidate invoices as needed on the invoice creation screen.",
    },
    {
      key: "StatementsPerBillingContact",
      label: "Statements Per Billing Contact",
      description:
        "Create statements per billing contact. If selected, pre-payments will NOT show on statements since these cannot be posted per billing contact (only per customer); once prepayments are applied to an invoice, they will show on the statements. If not selected, the statements will be created per customer.",
    },
    {
      key: "IsMagazineVisible",
      label: "Allow Magazine Drop Down in Statement",
      description:
        "Allow user to Enable/Disable the Magazine Drop Down for Statement Search.",
    },
    {
      key: "IsMirabelEmailTransSendEnabled",
      label: "Email from Marketing Manager",
      description:
        "Invoice, Statement and Proposal Emails will be sent via Marketing Manager.",
    },
    {
      key: "IsInvoicePdfEnabled",
      label: "Allow Invoice Pdf as Attachment",
      description:
        "Enable this option to send invoices as PDF attachments via email.",
    },
    {
      key: "IsFinanceChargesEnabled",
      label: "Finance Charges",
      description:
        "Adding finance charges to the selected invoice will create a separate misc. charge invoice for each selected invoices for the percentage of the total or the amount entered. The original invoices will not be changed. These new finance charge invoices can be seen in customer statements.",
    },
    {
      key: "IsPaymentPlanEnabled",
      label: "Payment Plans",
      description:
        "Allow users to set up payment plans on this site. This allows the application to create a set of installments for items grouped together on a proposal. These layer over the actual invoices to better control the amounts and dates for receivables and payments. *Note: Can't disable if any Payment Plans exist.",
    },
    {
      key: "IsARScheduleInvoiceEnabled",
      label: "Enable Schedule Invoices",
      description:
        "This feature will enable the option to schedule invoice creation based on the specified criteria.",
    },
    {
      key: "IsARSchedulePaymentEnabled",
      label: "Enable Schedule Payments",
      description:
        "This feature will enable the option to schedule payment creation based on the specified criteria.",
    },
  ],
};

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
  const {
    data: circulationTypes,
    isLoading: isTypesLoading,
    error: typesError,
  } = useCirculationTypes();

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
        </Tabs>
      </div>

      <Tabs value={activeTab} className="w-full">
        {/* Ad Management Tab */}
        <TabsContent value="adManagement" className="w-11/12 m-auto">
          <AdManagement
            state={state}
            handleInput={handleInput}
            handleToggle={handleToggle}
            settingsMeta={settingsMeta}
          />
        </TabsContent>

        {/* Account Receivable Settings */}
        <TabsContent value="accountReceivable" className="w-11/12 m-auto">
          <AccountReceivable
            state={state}
            handleInput={handleInput}
            handleToggle={handleToggle}
            settingsMeta={settingsMeta}
          />
        </TabsContent>

        {/* Production Tab */}
        <TabsContent value="production">
          <Production state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Circulation Settings */}
        <TabsContent value="circulationSettings">
          <CirculationSettings
            state={state}
            handleInput={handleInput}
            circulationTypes={circulationTypes}
            isTypesLoading={isTypesLoading}
            typesError={typesError}
          />
        </TabsContent>

        {/* Contact Management Tab */}
        <TabsContent value="contact">
          <ContactManagement
            state={state}
            handleInput={handleInput}
            handleToggle={handleToggle}
          />
        </TabsContent>

        {/* Customer Portal Tab */}
        <TabsContent value="customerPortal">
          <CustomerPortal state={state} handleInput={handleInput} />
        </TabsContent>

        {/* User Settings Tab */}
        <TabsContent value="userSettings">
          <UserSettings state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications">
          <Communications state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Google Calendar Tab */}
        <TabsContent value="googleCalendar">
          <GoogleCalendar
            state={state}
            handleToggle={handleToggle}
            handleInput={handleInput}
          />
        </TabsContent>

        {/* Marketing Manager Package Settings */}
        <TabsContent value="marketingManagerPackageSettings">
          <MarketingManagerPackage state={state} handleInput={handleInput} />
        </TabsContent>

        {/* Helpdesk Tab */}
        <TabsContent value="helpdesk">
          <Helpdesk state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Media MailKit Tab */}
        <TabsContent value="mediaMateAI">
          <MediaMateAI state={state} handleToggle={handleToggle} />
        </TabsContent>

        {/* Email Settings Tab */}
        <TabsContent value="emailSettings">
          <EmailSettings state={state} handleToggle={handleToggle} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button variant="default">Save</Button>
      </div>
    </div>
  );
}

export default memo(DashboardDemoPage);
