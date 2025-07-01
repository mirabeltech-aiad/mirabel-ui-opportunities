import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { settingsMeta } from '../helpers/configData';
import { useFeatureSettings } from '../context/Context';

function AccountReceivable() {
  const {
    state,
    handleToggle,
    handleInput,
  } = useFeatureSettings();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Account Receivable Settings</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Barter/Trade Display Name input */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label
              className="mb-1 text-base font-semibold"
              htmlFor="BarterDisplayName"
            >
              Barter/Trade Display Name
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              Use the word
              <Input
                id="BarterDisplayName"
                value={state.BarterDisplayName || ""}
                onChange={(e) =>
                  handleInput("BarterDisplayName", e.target.value)
                }
                placeholder="Trade"
                className="inline-block w-24 mx-1"
              />
              on invoices and statements to signify barter/trade.
            </p>
          </div>
        </div>

        {/* Checkboxes up to QuickBooks/Xero */}
        {settingsMeta.accountReceivable.map((item, idx) => (
          <div
            key={item.key}
            className={`flex items-center justify-between p-2 border-b`}
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
              id={item.key}
              checked={!!state[item.key]}
              onCheckedChange={() => handleToggle(item.key)}
            />
          </div>
        ))}

        {/* QuickBooks/Xero Integration row */}
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex flex-col items-start">
            <Label
              className="mb-1 text-base font-semibold"
              htmlFor="IsQBIntegrationEnabled"
            >
              Allow QuickBooks/Xero Integration
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              Enable QuickBooks/Xero integration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              id="QBIntegrationType"
              className="px-2 py-1 text-sm border rounded"
              value={state.QBIntegrationType || ""}
              onChange={(e) =>
                handleInput("QBIntegrationType", e.target.value)
              }
            >
              <option value="5">Xero</option>
              <option value="1">US Desktop Edition</option>
              <option value="3">Online Edition</option>
              <option value="4">Canadian Online Edition</option>
            </select>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                /* Disconnect logic here */
              }}
            >
              Disconnect QuickBooks/Xero
            </Button>
            <Switch
              id="IsQBIntegrationEnabled"
              checked={!!state.IsQBIntegrationEnabled}
              onCheckedChange={() =>
                handleToggle("IsQBIntegrationEnabled")
              }
            />
          </div>
        </div>

        {/* MultiCurrency Checkbox */}
        <div className="flex items-center justify-between p-2">
          <div className="flex flex-col items-start">
            <Label
              className="mb-1 text-base font-semibold"
              htmlFor="IsQBMultiCurrencyEnabled"
            >
              Enable MultiCurrency to QuickBooks/Xero
            </Label>
            <p className="text-sm text-left text-muted-foreground">
              This feature will enable Billed Currency Value sending to
              QuickBooks/Xero Transactions.
            </p>
          </div>
          <Switch
            id="IsQBMultiCurrencyEnabled"
            checked={!!state.IsQBMultiCurrencyEnabled}
            onCheckedChange={() =>
              handleToggle("IsQBMultiCurrencyEnabled")
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountReceivable;