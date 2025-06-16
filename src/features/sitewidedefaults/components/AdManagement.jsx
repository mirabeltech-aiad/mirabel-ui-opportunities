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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import { settingsMeta } from '../helpers/configData';
import { useFeatureSettings } from '../context/Context';

const separatorOptions = [
    { value: "", label: "" },
    { value: "' '", label: " " },
    { value: "':'", label: ":" },
    { value: "','", label: "," },
    { value: "'-'", label: "-" },
  ];

export function AdManagement() {
  const {
    state,
    handleToggle,
    handleInput,
  } = useFeatureSettings();
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ad - Management Settings</CardTitle>
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
            {item.input ? (
              <Input
                id={item.key}
                value={state[item.key] || ""}
                onChange={(e) => handleInput(item.key, e.target.value)}
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

        {/* Default Sales Rep Section */}
        <div className="flex flex-col p-2 border-b">
          <Label
            className="mb-1 text-base font-semibold"
            htmlFor="LoggedInRepChoiceProposal"
          >
            Default Sales Rep for Item Entry
          </Label>
          <div className="flex flex-row flex-wrap items-center gap-4">
            <div className="flex flex-row items-center min-w-[420px]">
              <select
                id="LoggedInRepChoiceProposal"
                className="px-2 py-1 mr-2 border rounded"
                value={state.LoggedInRepChoiceProposal === false ? "false" : "true"}
                onChange={(e) =>
                  handleInput(
                    "LoggedInRepChoiceProposal",
                    e.target.value === "true"
                  )
                }
              >
                <option value="true">Logged in Rep</option>
                <option value="false">Rep on Client Account</option>
              </select>
              <span className="ml-2 text-sm text-muted-foreground">
                for the default sales rep that is assigned to a new item on <b>proposals</b>.
              </span>
            </div>
            <div className="flex flex-row items-center min-w-[420px] mt-2 md:mt-0">
              <select
                id="LoggedInRepChoice"
                className="px-2 py-1 mr-2 border rounded"
                value={state.LoggedInRepChoice === false ? "false" : "true"}
                onChange={(e) =>
                  handleInput(
                    "LoggedInRepChoice",
                    e.target.value === "true"
                  )
                }
              >
                <option value="true">Logged in Rep</option>
                <option value="false">Rep on Client Account</option>
              </select>
              <span className="ml-2 text-sm text-muted-foreground">
                for the default sales rep that is assigned to a new item on <b>order</b>.
              </span>
            </div>
          </div>
        </div>

        {/* Additional Insertion Years Section */}
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
                  handleInput(
                    "IssueYearCheckBoxEnd",
                    parseInt(e.target.value, 10)
                  )
                }
              />{" "}
              years of issues starting with the year{" "}
              <Input
                type="number"
                min={0}
                className="w-16 mx-2"
                value={state.IssueYearCheckBoxStart || -1}
                onChange={(e) =>
                  handleInput(
                    "IssueYearCheckBoxStart",
                    parseInt(e.target.value, 10)
                  )
                }
              />{" "}
              (use -1 for the current year)
            </div>
          </div>
        </div>

        {/* Credit Limit Sections */}
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
            onCheckedChange={() => handleToggle("CheckCreditLimitOnPropose")}
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
            onCheckedChange={() => handleToggle("CheckCreditLimitOnAdd")}
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

        {/* Inventory Check Section */}
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

        {/* Inventory Settings Grid */}
        <div className="flex flex-col gap-4 p-2 border-b md:flex-row">
          {/* Proposal Items */}
          <div className="border rounded p-3 flex-1 min-w-[220px]">
            <div className="mb-2 font-semibold text-center">
              Proposal Items
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="proposalInventoryWarning"
                  checked={state.InvPropCheck || false}
                  onCheckedChange={() => handleToggle("InvPropCheck")}
                />
                <Label htmlFor="proposalInventoryWarning">
                  Inventory Warning
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="proposalStopProcessing"
                  checked={state.StopInvPropFail || false}
                  onCheckedChange={() => handleToggle("StopInvPropFail")}
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
                  checked={state.InvCheck || false}
                  onCheckedChange={() => handleToggle("InvCheck")}
                />
                <Label htmlFor="orderInventoryWarning">
                  Inventory Warning
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="orderStopProcessing"
                  checked={state.StopInvFail || false}
                  onCheckedChange={() => handleToggle("StopInvFail")}
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
          handlePickupInput={(key, value) =>
            handleInput("PickupFromSettings", {
              ...state.PickupFromSettings,
              [key]: value,
            })
          }
        />
      </CardContent>
    </Card>
  );
}

function PickupFromSection({ pickupState = {}, handlePickupInput }) {
    const [pickupOptions, setPickupOptions] = useState([
      { Key: "", Description: "", Script: "''" },
      {
        Key: "ProductName",
        Description: "Product Name",
        Script: "ISNULL(gsPublications.PubName,'')",
      },
      {
        Key: "Description",
        Description: "Description",
        Script: "ISNULL(gsContracts.Description,'')",
      },
      {
        Key: "IssueName",
        Description: "Issue Name",
        Script: "ISNULL(tblMagFrequency.IssueName,'')",
      },
      {
        Key: "IssueYear",
        Description: "Issue Year",
        Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueYear),'')",
      },
      {
        Key: "IssueDate",
        Description: "Issue Date",
        Script: "ISNULL(CONVERT(VARCHAR,tblMagFrequency.IssueDate,101),'')",
      },
      {
        Key: "AdSize",
        Description: "Ad Size",
        Script: "ISNULL(gsAdSize.AdSizeName,'')",
      },
      {
        Key: "Frequency",
        Description: "Frequency",
        Script: "ISNULL(gsContracts.Frequency,'')",
      },
      {
        Key: "Color",
        Description: "Color",
        Script: "ISNULL(gsContracts.Color,'')",
      },
      {
        Key: "Position",
        Description: "Position",
        Script: "ISNULL(gsContracts.PosReq1,'')",
      },
      {
        Key: "Section",
        Description: "Section",
        Script: "ISNULL(gsPubSections.SectionName,'')",
      },
      {
        Key: "AdName",
        Description: "Ad Name",
        Script: "ISNULL(gsContracts.AdName,'')",
      },
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
      const otherValues = pickupKeys
        .filter((k) => k !== fieldKey)
        .map((k) => pickupState[k]);
      if (value !== "''" && otherValues.includes(value)) {
        window.alert("This field is already used in another dropdown.");
        handlePickupInput(fieldKey, "''");
        return;
      }
      handlePickupInput(fieldKey, value);
    };
  
    return (
      <div className="mt-6 mb-2">
        <Label className="block mb-1 text-base font-semibold">
          'Pickup From' Description
        </Label>
        <div className="mb-3 text-sm text-muted-foreground">
          Choose the data to display in the 'Pickup From' drop down lists and
          reports in order to give users the information they need to choose or
          view the correct insertion to pick up
        </div>
        <div className="flex flex-col gap-2">
          {/* First field (no separator) */}
          <select
            className="border rounded px-2 py-0.5 h-8 text-sm min-w-[140px]"
            value={(pickupState && pickupState.PickupFrom1) || "''"}
            onChange={(e) =>
              handlePickupFromChange("PickupFrom1", e.target.value)
            }
          >
            {pickupOptions.map((opt) => (
              <option key={opt.Script} value={opt.Script}>
                {opt.Description}
              </option>
            ))}
          </select>
          {/* Remaining fields with separators */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-row items-center gap-2">
              <select
                className="border rounded px-2 py-0.5 h-8 text-sm w-12"
                value={(pickupState && pickupState[separatorKeys[i - 1]]) || ""}
                onChange={(e) =>
                  handlePickupInput(separatorKeys[i - 1], e.target.value)
                }
              >
                {separatorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <select
                className="border rounded px-2 py-0.5 h-8 text-sm min-w-[140px]"
                value={(pickupState && pickupState[pickupKeys[i]]) || "''"}
                onChange={(e) =>
                  handlePickupFromChange(pickupKeys[i], e.target.value)
                }
              >
                {pickupOptions.map((opt) => (
                  <option key={opt.Script} value={opt.Script}>
                    {opt.Description}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }
