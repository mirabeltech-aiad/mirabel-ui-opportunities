import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSiteWideList } from "./hooks/useSiteWideList";
import { useStoreSupply } from "./context/StoreSupplyContext";
const initialSettings = {
  adManagement: {
    installmentBilling: true,
    multiplePublicationSelection: false,
    allowInsertions: true,
    allowAdjustments: false,
    allowProductionCharges: false,
    allowMultipleOrders: true,
    allowTestImpression: false,
    allowMoveOrders: false,
    requireProductFields: true,
    displayCreditLimit: false,
    creditLimitEnforced: false,
    creditLimitDays: "",
    defaultRepProposal: "Logged in Rep",
    defaultRepOrder: "Logged in Rep",
    proposalInventoryWarning: false,
    proposalStopProcessing: false,
    orderInventoryWarning: false,
    orderStopProcessing: false,
  },
  account: {
    batchUpdate: false,
    groupBy: false,
    chargeableSubscriptions: false,
    levelPricing: false,
    orderEntry: true,
    multiProposal: false,
    opportunity: false,
    emergencyBackup: false,
    digitalOrder: false,
    savePayment: false,
    paymentApproval: false,
    enableMultiCurrency: false,
  },
  production: {
    digitalStudio: false,
    enableProject: false,
  },
  contact: {
    allowJobEdit: false,
    callDisposition: false,
    displayReport: false,
    primaryContactSwitch: false,
    billingContact: false,
    enableCloud: false,
  },
  customerPortal: {
    enable: false,
  },
  userSettings: {
    restrictCustomerSearch: false,
    restrictCalendar: false,
    restrictProduct: false,
    enableEmailCapture: false,
    summaryEmail: false,
    marketingManager: false,
    repNotifications: false,
  },
  communications: {
    campaign: false,
    mailingManager: false,
    mailer: false,
    enableHelpdesk: false,
  },
  googleCalendar: {
    enable: false,
    apiKey: "",
  },
  helpdesk: {
    enable: false,
  },
  mediaMailKit: {
    sendLead: false,
    sendAd: false,
    sendEmail: false,
    enableKit: false,
  },
};

const tabList = [
  { value: "adManagement", label: "Ad Management" },
  { value: "accountReceivable", label: "Account Receivable" },
  { value: "production", label: "Production" },
  { value: "circulationSettings", label: "Circulation Settings" },
  { value: "contact", label: "Contact Management" },
  { value: "customerPortal", label: "Customer Portal" },
  { value: "userSettings", label: "User Settings" },
  { value: "emailSettings", label: "Email Settings" },
  { value: "communications", label: "Communications" },
  { value: "googleCalendar", label: "Google Calendar" },
  {
    value: "marketingManagerPackageSettings",
    label: "Marketing Manager Package Settings",
  },
  { value: "helpdesk", label: "Helpdesk" },
  { value: "mediaMateAI", label: "Media Mate AI" },
];

// Settings metadata for headings and descriptions
const settingsMeta = {
  adManagement: [
    {
      key: "installment_billing",
      label: "Allow Installment Billing",
      description:
        "Set up your magazine manager site to allow ad sales to be split up for installment billing.",
    },
    {
      key: "multiple_publication_selection",
      label: "Allow Multiple Publication Selection",
      description:
        "Set up your magazine manager site for multiple publications to be selected for ad sales and proposals.",
    },
    {
      key: "default_gross_rate",
      label: "Default to Gross Rate Card",
      description:
        "Check this box to default new rate cards as being 'Gross' rates, leave unchecked to default to 'Net' rates.",
      enabled: false,
    },
    {
      key: "insertion_surcharges_discounts",
      label: "Allow Insertion Surcharges and Discounts",
      description:
        "Allow surcharges and discounts to be created and added to ad sales and proposals.",
    },
    {
      key: "net_adjustments",
      label: "Allow Net Adjustments",
      description:
        "Allow the user to type in a Net amount, and have the system automatically apply a default charge or discount.",
    },
    {
      key: "production_charges",
      label: "Allow Production Charges",
      description:
        "Allow the user to enter Production Charges for Orders and Proposals.",
    },
    {
      key: "shared_job_jacket",
      label: "Shared Job Jacket",
      description: "Allow multiple orders on the same job jacket.",
    },
    {
      key: "text_image_tab",
      label: "TextImage Tab",
      description:
        "Allow TextImage Changes in JobJacket. Note: This will not affect the invoice or quantity on order. It will just allow to change the text/image in the job jacket.",
    },

    //

    {
      key: "e_signature",
      label: "eSignature",
      description:
        "Enable electronic signing of documents using RightSignature.",
      enabled: false,
    },
    {
      key: "batch_update",
      label: "Batch Update",
      description: "Enable Batch Update.",
      enabled: false,
    },
    {
      key: "group_buy",
      label: "Group Buy",
      description: "Enable Group Buy.",
      enabled: false,
    },
    {
      key: "chargebrite_subscriptions",
      label: "ChargeBrite Subscriptions",
      description: "Enable the ChargeBrite application on your site.",
      enabled: false,
    },
    {
      key: "level_pricing_multiple_products",
      label: "Level Pricing for Multiple Products",
      description:
        "Allow users to enter different rates when adding multiple products to an order buy.",
      enabled: false,
    },
    {
      key: "order_entry_by_business_unit",
      label: "Order Entry by Business Unit",
      description:
        "Start the order entry process by selecting a business unit.",
      enabled: false,
    },
    {
      key: "link_opportunity_to_proposals",
      label: "Add/Link an Opportunity to Proposals",
      description:
        "Display a Button to link a proposal to an existing opportunity or create a new one for the proposal.",
      enabled: false,
    },
    {
      key: "require_opportunity_for_proposal",
      label: "Require Opportunity for Proposal",
      description:
        "Require an Opportunity to be created or linked in order to save a proposal.",
      enabled: false,
    },
    {
      key: "emergency_backup",
      label: "Emergency Backup",
      description:
        "This feature will enable the Emergency Backup Plan, which uploads data backup files of specific features to destinations such as Google Drive, Dropbox, FTP etc.",
      enabled: false,
    },
    {
      key: "enable_internal_approval",
      label: "Enable Internal Approval",
      description: "Set Up Internal Approval Process.",
      enabled: false,
    },
    {
      key: "commissioned_rep_change",
      label: "Commissioned Rep Change",
      description: "Change Commissioned Rep with Change Order only.",
      enabled: false,
    },
    {
      key: "chargebrite_media_orders",
      label: "ChargeBrite Media Orders",
      description:
        "Enable the ChargeBrite Media Orders application on your site.",
      enabled: false,
    },
    {
      key: "save_payment_on_approval",
      label: "Save Payment Information On Proposal Approval",
      description:
        "Selecting this checkbox will allow customers to store their payment information through a new 'Update Card Details' modal window that opens upon signing and approving the proposal.",
      enabled: false,
    },
  ],

  // Add similar metadata for other sections as needed
};

export default function DashboardDemoPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [tabWindow, setTabWindow] = useState([0, 5]);
  const [activeTab, setActiveTab] = useState(tabList[0].value);
  const { data, isLoading: apiLoading, error: apiError } = useSiteWideList();

  // Store Supply State
  const {
    storeSupply,
    updateInventory,
    updateSuppliers,
    isLoading: storeLoading,
    error: storeError,
  } = useStoreSupply();

  // Supplier state
  const [newSupplier, setNewSupplier] = useState("");

  const handleAddSupplier = () => {
    if (
      newSupplier.trim() &&
      !storeSupply.suppliers.preferredSuppliers.includes(newSupplier.trim())
    ) {
      updateSuppliers({
        preferredSuppliers: [
          ...storeSupply.suppliers.preferredSuppliers,
          newSupplier.trim(),
        ],
      });
      setNewSupplier("");
    }
  };

  const handleRemoveSupplier = (supplierToRemove) => {
    updateSuppliers({
      preferredSuppliers: storeSupply.suppliers.preferredSuppliers.filter(
        (supplier) => supplier !== supplierToRemove
      ),
    });
  };

  console.log("datadatadatadatadata", data);

  const handleToggle = (section, key) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key],
      },
    }));
  };

  const handleInput = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handlePrevTabs = () => {
    setTabWindow(([start, end]) => {
      if (start === 0) return [0, 5];
      return [start - 1, end - 1];
    });
  };
  const handleNextTabs = () => {
    setTabWindow(([start, end]) => {
      if (end >= tabList.length) return [tabList.length - 5, tabList.length];
      return [start + 1, end + 1];
    });
  };

  return (
    <div className="container px-8 py-8 mx-auto">
      <div className="sticky top-0 z-20 pb-2 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  {storeLoading ? (
                    <div>Loading inventory settings...</div>
                  ) : storeError ? (
                    <div>
                      Error loading inventory settings: {storeError.message}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="track-inventory">Track Inventory</Label>
                        <Switch
                          id="track-inventory"
                          checked={storeSupply.inventory.trackInventory}
                          onCheckedChange={() =>
                            updateInventory({
                              trackInventory:
                                !storeSupply.inventory.trackInventory,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="low-stock-alert">
                          Low Stock Alerts
                        </Label>
                        <Switch
                          id="low-stock-alert"
                          checked={storeSupply.inventory.lowStockAlert}
                          onCheckedChange={() =>
                            updateInventory({
                              lowStockAlert:
                                !storeSupply.inventory.lowStockAlert,
                            })
                          }
                          disabled={!storeSupply.inventory.trackInventory}
                        />
                      </div>

                      {storeSupply.inventory.lowStockAlert && (
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="threshold">Low Stock Threshold</Label>
                          <Input
                            id="threshold"
                            type="number"
                            value={storeSupply.inventory.lowStockThreshold}
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
                          checked={storeSupply.inventory.autoReorder}
                          onCheckedChange={() =>
                            updateInventory({
                              autoReorder: !storeSupply.inventory.autoReorder,
                            })
                          }
                          disabled={!storeSupply.inventory.trackInventory}
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
                  {storeLoading ? (
                    <div>Loading supplier settings...</div>
                  ) : storeError ? (
                    <div>
                      Error loading supplier settings: {storeError.message}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="new-supplier">
                          Add Preferred Supplier
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-supplier"
                            value={newSupplier}
                            onChange={(e) => setNewSupplier(e.target.value)}
                            placeholder="Enter supplier name"
                          />
                          <Button onClick={handleAddSupplier}>Add</Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Suppliers</Label>
                        {storeSupply.suppliers.preferredSuppliers.length ===
                        0 ? (
                          <p className="text-sm text-muted-foreground">
                            No preferred suppliers added yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {storeSupply.suppliers.preferredSuppliers.map(
                              (supplier, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <span>{supplier}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveSupplier(supplier)
                                    }
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
      {/* Ad Management Tab */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="adManagement" className="w-11/12 m-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ad Management Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {settingsMeta.adManagement.map((item, idx) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-2 ${
                    idx !== settingsMeta.adManagement.length - 1
                      ? "border-b"
                      : ""
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
                  <Switch
                    checked={settings.adManagement[item.key] || false}
                    onCheckedChange={() =>
                      handleToggle("adManagement", item.key)
                    }
                  />
                </div>
              ))}

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start ">
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
                      value={settings.adManagement.creditLimitDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "adManagement",
                          "creditLimitDays",
                          e.target.value
                        )
                      }
                    />{" "}
                    years of issues starting with the year{" "}
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={settings.adManagement.creditLimitDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "adManagement",
                          "creditLimitDays",
                          e.target.value
                        )
                      }
                    />{" "}
                    (use -1 for the current year)
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-2 ">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Allow Non-Admins to Move Orders"}
                  >
                    Allow Non-Admins to Move Orders
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Allow Reps to move Orders from one contact record to
                    another.
                  </p>
                </div>
                <Switch
                  checked={
                    settings.adManagement["Allow Non-Admins to Move Orders"] ||
                    false
                  }
                  onCheckedChange={() =>
                    handleToggle(
                      "adManagement",
                      "Allow Non-Admins to Move Orders"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 ">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Required Fields during Add Contact"}
                  >
                    Required Fields during Add Contact
                  </Label>
                  <p className="text-sm text-left text-muted-foreground">
                    Required Fields must be filled in to add a new contact.
                  </p>
                </div>
                <Switch
                  checked={
                    settings.adManagement[
                      "Required Fields during Add Contact"
                    ] || false
                  }
                  onCheckedChange={() =>
                    handleToggle(
                      "adManagement",
                      "Required Fields during Add Contact"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start ">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Show Additional Insertion Years"}
                  >
                    Display Credit Limit on Runsheet
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    Clients that have an unpaid balance more than{" "}
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={settings.adManagement.creditLimitDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "adManagement",
                          "creditLimitDays",
                          e.target.value
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit will be
                    displayed in red on the "Sales Runsheet" report.
                  </div>
                </div>
                <Switch
                  checked={
                    settings.adManagement[
                      "Required Fields during Add Contact"
                    ] || false
                  }
                  onCheckedChange={() =>
                    handleToggle(
                      "adManagement",
                      "Required Fields during Add Contact"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Show Additional Insertion Years"}
                  >
                    Don't Allow Proposals for Customers Over their Credit Limit{" "}
                  </Label>
                  <div className="flex flex-wrap text-sm text-muted-foreground">
                    Do not allow proposals to be created for clients that have
                    an unpaid balance more than
                    <Input
                      type="number"
                      min={0}
                      className="w-16 mx-2"
                      value={settings.adManagement.creditLimitDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "adManagement",
                          "creditLimitDays",
                          e.target.value
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit. The credit
                    limit is set on the "Details" page of a contact
                  </div>
                </div>
                <Switch
                  checked={
                    settings.adManagement[
                      "Required Fields during Add Contact"
                    ] || false
                  }
                  onCheckedChange={() =>
                    handleToggle(
                      "adManagement",
                      "Required Fields during Add Contact"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Show Additional Insertion Years"}
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
                      value={settings.adManagement.creditLimitDays || ""}
                      onChange={(e) =>
                        handleInput(
                          "adManagement",
                          "creditLimitDays",
                          e.target.value
                        )
                      }
                    />{" "}
                    days past due that are over their credit limit. The credit
                    limit is set on the "Details" page of a contact.
                  </div>
                </div>
                <Switch
                  checked={
                    settings.adManagement[
                      "Required Fields during Add Contact"
                    ] || false
                  }
                  onCheckedChange={() =>
                    handleToggle(
                      "adManagement",
                      "Required Fields during Add Contact"
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex flex-col items-start">
                  <Label
                    className="mb-1 text-base font-semibold"
                    htmlFor={"Show Additional Insertion Years"}
                  >
                    Default Sales
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 ">
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

              <div className="flex flex-col gap-4 md:flex-row">
                {/* Proposal Items */}
                <div className="border rounded p-3 flex-1 min-w-[220px]">
                  <div className="mb-2 font-semibold text-center">
                    Proposal Items
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="proposalInventoryWarning"
                        checked={
                          settings.adManagement.proposalInventoryWarning ||
                          false
                        }
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
                        checked={
                          settings.adManagement.proposalStopProcessing || false
                        }
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
                        checked={
                          settings.adManagement.orderInventoryWarning || false
                        }
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
                        checked={
                          settings.adManagement.orderStopProcessing || false
                        }
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
            </CardContent>
          </Card>
          {/* Additional Controls Card */}
        </TabsContent>
        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Account Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Batch Update</Label>
                <Switch
                  checked={settings.account.batchUpdate}
                  onCheckedChange={() => handleToggle("account", "batchUpdate")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Group By</Label>
                <Switch
                  checked={settings.account.groupBy}
                  onCheckedChange={() => handleToggle("account", "groupBy")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Chargeable Subscriptions</Label>
                <Switch
                  checked={settings.account.chargeableSubscriptions}
                  onCheckedChange={() =>
                    handleToggle("account", "chargeableSubscriptions")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Level Pricing for Products</Label>
                <Switch
                  checked={settings.account.levelPricing}
                  onCheckedChange={() =>
                    handleToggle("account", "levelPricing")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Order Entry for Business</Label>
                <Switch
                  checked={settings.account.orderEntry}
                  onCheckedChange={() => handleToggle("account", "orderEntry")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Multi/Remix Opportunity for Proposals</Label>
                <Switch
                  checked={settings.account.multiProposal}
                  onCheckedChange={() =>
                    handleToggle("account", "multiProposal")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Opportunity for Proposals</Label>
                <Switch
                  checked={settings.account.opportunity}
                  onCheckedChange={() => handleToggle("account", "opportunity")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Emergency Backup Files</Label>
                <Switch
                  checked={settings.account.emergencyBackup}
                  onCheckedChange={() =>
                    handleToggle("account", "emergencyBackup")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Digital Order</Label>
                <Switch
                  checked={settings.account.digitalOrder}
                  onCheckedChange={() =>
                    handleToggle("account", "digitalOrder")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Save Payment Information</Label>
                <Switch
                  checked={settings.account.savePayment}
                  onCheckedChange={() => handleToggle("account", "savePayment")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Payment Approval</Label>
                <Switch
                  checked={settings.account.paymentApproval}
                  onCheckedChange={() =>
                    handleToggle("account", "paymentApproval")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Multi-Currency</Label>
                <Switch
                  checked={settings.account.enableMultiCurrency}
                  onCheckedChange={() =>
                    handleToggle("account", "enableMultiCurrency")
                  }
                />
              </div>
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
              <div className="flex items-center justify-between">
                <Label>Enable Digital Studio Project Access</Label>
                <Switch
                  checked={settings.production.digitalStudio}
                  onCheckedChange={() =>
                    handleToggle("production", "digitalStudio")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Project Access</Label>
                <Switch
                  checked={settings.production.enableProject}
                  onCheckedChange={() =>
                    handleToggle("production", "enableProject")
                  }
                />
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
                  checked={settings.contact.allowJobEdit}
                  onCheckedChange={() =>
                    handleToggle("contact", "allowJobEdit")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Call Disposition</Label>
                <Switch
                  checked={settings.contact.callDisposition}
                  onCheckedChange={() =>
                    handleToggle("contact", "callDisposition")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Display Report</Label>
                <Switch
                  checked={settings.contact.displayReport}
                  onCheckedChange={() =>
                    handleToggle("contact", "displayReport")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Primary Contact Switch</Label>
                <Switch
                  checked={settings.contact.primaryContactSwitch}
                  onCheckedChange={() =>
                    handleToggle("contact", "primaryContactSwitch")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Billing Contact</Label>
                <Switch
                  checked={settings.contact.billingContact}
                  onCheckedChange={() =>
                    handleToggle("contact", "billingContact")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Cloud Communications</Label>
                <Switch
                  checked={settings.contact.enableCloud}
                  onCheckedChange={() => handleToggle("contact", "enableCloud")}
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
                <Label>Enable Customer Portal</Label>
                <Switch
                  checked={settings.customerPortal.enable}
                  onCheckedChange={() =>
                    handleToggle("customerPortal", "enable")
                  }
                />
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
                  checked={settings.userSettings.restrictCustomerSearch}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "restrictCustomerSearch")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Calendar Access</Label>
                <Switch
                  checked={settings.userSettings.restrictCalendar}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "restrictCalendar")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Restrict Product Access</Label>
                <Switch
                  checked={settings.userSettings.restrictProduct}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "restrictProduct")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Email Capture</Label>
                <Switch
                  checked={settings.userSettings.enableEmailCapture}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "enableEmailCapture")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Summary Email Notifications</Label>
                <Switch
                  checked={settings.userSettings.summaryEmail}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "summaryEmail")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Marketing Manager Notifications</Label>
                <Switch
                  checked={settings.userSettings.marketingManager}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "marketingManager")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Rep Notifications</Label>
                <Switch
                  checked={settings.userSettings.repNotifications}
                  onCheckedChange={() =>
                    handleToggle("userSettings", "repNotifications")
                  }
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
                  checked={settings.communications.campaign}
                  onCheckedChange={() =>
                    handleToggle("communications", "campaign")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailing Manager</Label>
                <Switch
                  checked={settings.communications.mailingManager}
                  onCheckedChange={() =>
                    handleToggle("communications", "mailingManager")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Mailer</Label>
                <Switch
                  checked={settings.communications.mailer}
                  onCheckedChange={() =>
                    handleToggle("communications", "mailer")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Helpdesk</Label>
                <Switch
                  checked={settings.communications.enableHelpdesk}
                  onCheckedChange={() =>
                    handleToggle("communications", "enableHelpdesk")
                  }
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
                  checked={settings.googleCalendar.enable}
                  onCheckedChange={() =>
                    handleToggle("googleCalendar", "enable")
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={settings.googleCalendar.apiKey}
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
                  checked={settings.helpdesk.enable}
                  onCheckedChange={() => handleToggle("helpdesk", "enable")}
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
                  checked={settings.mediaMailKit.sendLead}
                  onCheckedChange={() =>
                    handleToggle("mediaMailKit", "sendLead")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Ad as HTML</Label>
                <Switch
                  checked={settings.mediaMailKit.sendAd}
                  onCheckedChange={() => handleToggle("mediaMailKit", "sendAd")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Send Email as HTML</Label>
                <Switch
                  checked={settings.mediaMailKit.sendEmail}
                  onCheckedChange={() =>
                    handleToggle("mediaMailKit", "sendEmail")
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Media MailKit</Label>
                <Switch
                  checked={settings.mediaMailKit.enableKit}
                  onCheckedChange={() =>
                    handleToggle("mediaMailKit", "enableKit")
                  }
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
