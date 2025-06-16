import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function ContactManagement({ state, handleInput, handleToggle }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Contact Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Allow Job # Edit */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label htmlFor="AllowEditAdNumber" className="font-semibold">Allow Job # Editing</Label>
            <p className="text-sm text-muted-foreground">Allow user to edit the Job # number on an Order</p>
          </div>
          <Switch
            id="AllowEditAdNumber"
            checked={!!state.AllowEditAdNumber}
            onCheckedChange={() => handleToggle("AllowEditAdNumber")}
          />
        </div>

        {/* Call Disposition */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label htmlFor="IsCallDispositionEnabled" className="font-semibold">Enable Call Disposition</Label>
            <p className="text-sm text-muted-foreground">Allow to mark call as complete with call disposition</p>
          </div>
          <Switch
            id="IsCallDispositionEnabled"
            checked={!!state.IsCallDispositionEnabled}
            onCheckedChange={() => handleToggle("IsCallDispositionEnabled")}
          />
        </div>

        {/* State/Region Input */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label htmlFor="IsStateAsTextBox" className="font-semibold">State/Region Input</Label>
            <p className="text-sm text-muted-foreground">Choose whether to use a drop down list to select US states and Canadian Regions or use a text box to type in the region/state.</p>
          </div>
          <select
            id="IsStateAsTextBox"
            value={state.IsStateAsTextBox ? "true" : "false"}
            onChange={e => handleInput("IsStateAsTextBox", e.target.value === "true")}
          >
            <option value="false">Drop down</option>
            <option value="true">Textbox</option>
          </select>
        </div>

        {/* Primary Contact Switch */}
        <div className="p-2 border-b">
          <Label htmlFor="IsEnablePrimaryContactSwitch" className="block mb-2 font-semibold">
            Primary Contact Switch
          </Label>
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex items-center justify-between">
              <span>Allow users to switch the company/primary contact with one of the sub-contacts.</span>
              <Switch
                id="IsEnablePrimaryContactSwitch"
                checked={!!state.IsEnablePrimaryContactSwitch}
                onCheckedChange={() => handleToggle("IsEnablePrimaryContactSwitch")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Only admin users can switch contacts.</span>
              <Switch
                id="IsEnablePrimaryContactSwitchForAdminOnly"
                checked={!!state.IsEnablePrimaryContactSwitchForAdminOnly}
                onCheckedChange={() => handleToggle("IsEnablePrimaryContactSwitchForAdminOnly")}
              />
            </div>
          </div>
          <div className="my-2 ml-4 text-sm text-muted-foreground">
            Orders, invoices, proposal line items, and payment plans in [Magazine Manager/Newspaper Manager] can be set to "default billing contact", which looks up whoever is set as the billing contact at the time the item is created.<br /><br />
            Leaving a box unchecked will keep the existing items that are set to "default billing contact" unchanged; they'll continue to look up the current default billing contact as defined on the company record.
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing proposal line items that were set to "default billing contact" to that previous primary contact.</span>
              <Switch
                id="SwitchProposals"
                checked={!!state.SwitchProposals}
                onCheckedChange={() => handleToggle("SwitchProposals")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing orders & installments that were set to "default billing contact" to that previous primary contact.</span>
              <Switch
                id="SwitchOrders"
                checked={!!state.SwitchOrders}
                onCheckedChange={() => handleToggle("SwitchOrders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing invoices that were set to "default billing contact" to that previous primary contact.</span>
              <Switch
                id="SwitchInvoices"
                checked={!!state.SwitchInvoices}
                onCheckedChange={() => handleToggle("SwitchInvoices")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing payment plan installments that were set to "default billing contact" to that previous primary contact.</span>
              <Switch
                id="SwitchPaymentPlan"
                checked={!!state.SwitchPaymentPlan}
                onCheckedChange={() => handleToggle("SwitchPaymentPlan")}
              />
            </div>
          </div>
        </div>

        {/* Billing Contact Remove */}
        <div className="p-2 border-b">
          <Label htmlFor="IsBillingContactRemoveEnabled" className="block mb-2 font-semibold">
            Billing Contact Remove
          </Label>
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex items-center justify-between">
              <span>Allow users to remove the billing contact type.</span>
              <Switch
                id="IsBillingContactRemoveEnabled"
                checked={!!state.IsBillingContactRemoveEnabled}
                onCheckedChange={() => handleToggle("IsBillingContactRemoveEnabled")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Only admin users can remove the billing contact type.</span>
              <Switch
                id="CanAdminOnlyRemoveBillingContact"
                checked={!!state.CanAdminOnlyRemoveBillingContact}
                onCheckedChange={() => handleToggle("CanAdminOnlyRemoveBillingContact")}
              />
            </div>
          </div>
          <div className="my-2 ml-4 text-sm text-muted-foreground">
            Orders, invoices, proposal line items, and payment plans in [Magazine Manager/Newspaper Manager] can be set to "default billing contact", which looks up whoever is set as the billing contact at the time the item is created.<br /><br />
            Leaving a box unchecked will keep the existing items that are set to "default billing contact" unchanged; they'll continue to look up the current default billing contact as defined on the company record.
          </div>
          <div className="flex flex-col gap-2 ml-4">
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing proposal line items that were set to "default billing contact" to that previous contact.</span>
              <Switch
                id="SwitchProposalsOnBCR"
                checked={!!state.SwitchProposalsOnBCR}
                onCheckedChange={() => handleToggle("SwitchProposalsOnBCR")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing orders & installments that were set to "default billing contact" to that previous contact.</span>
              <Switch
                id="SwitchOrdersOnBCR"
                checked={!!state.SwitchOrdersOnBCR}
                onCheckedChange={() => handleToggle("SwitchOrdersOnBCR")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing invoices that were set to "default billing contact" to that previous contact.</span>
              <Switch
                id="SwitchInvoicesOnBCR"
                checked={!!state.SwitchInvoicesOnBCR}
                onCheckedChange={() => handleToggle("SwitchInvoicesOnBCR")}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Check this box if you want to permanently assign all existing payment plan installments that were set to "default billing contact" to that previous contact.</span>
              <Switch
                id="SwitchPaymentPlansOnBCR"
                checked={!!state.SwitchPaymentPlansOnBCR}
                onCheckedChange={() => handleToggle("SwitchPaymentPlansOnBCR")}
              />
            </div>
          </div>
        </div>

        {/* Enable Cloud Communication */}
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-start">
            <Label htmlFor="IsCloudCommunicationEnabled" className="font-semibold">Enable Cloud Communication</Label>
            <p className="text-sm text-muted-foreground">Selecting this checkbox allows users to initiate calls to contact phone numbers directly within the application.</p>
          </div>
          <Switch
            id="IsCloudCommunicationEnabled"
            checked={!!state.IsCloudCommunicationEnabled}
            onCheckedChange={() => handleToggle("IsCloudCommunicationEnabled")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ContactManagement;