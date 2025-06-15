import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Package type options and descriptions
const packageTypeOptions = [
  { value: "Trial", label: "Trial" },
  { value: "CRM", label: "CRM" },
  { value: "CRM + MKM", label: "CRM + MKM" },
  { value: "Other CRM Int + DATA", label: "Other CRM Int + DATA" },
  { value: "CRM + DATA", label: "CRM + DATA" },
  { value: "CRM + MKM + DATA", label: "CRM + MKM + DATA" },
];

const packageTypeDescriptions = {
  Trial: "Trial Version",
  CRM: "CRM/MagazineManager Only",
  "CRM + MKM": "CRM, Marketing Manager Reports and Content Analytics",
  "Other CRM Int + DATA": "Browser Extension with third party CRM Integration",
  "CRM + DATA": "CRM, Prospecting Dashboard and Browser Extension with data restrictions",
  "CRM + MKM + DATA": "CRM, Marketing Manager Reports, Prospecting Dashboard with data restriction and Browser Extension with data restrictions",
};

// Which package types show the Data Pack section
const showDataPackTypes = [
  "Other CRM Int + DATA",
  "CRM + DATA",
  "CRM + MKM + DATA",
];

const dataPackTypeOptions = [
  { value: "Basic", label: 150 },
  { value: "Standard", label: 300 },
  { value: "Enterprise", label: 1000 },
];

function PackageDetailsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">Package Type</th>
            <th className="px-2 py-1 border">Data Pack Type</th>
            <th className="px-2 py-1 border">Base Data Pack Count</th>
            <th className="px-2 py-1 border">Effective count of Data Packs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 font-bold border">Trial</td>
            <td className="px-2 py-1 border">N/A</td>
            <td className="px-2 py-1 border">N/A</td>
            <td className="px-2 py-1 border">N/A</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function UsersWithDataPacksTable() {
  return (
    <div className="overflow-x-auto">
      <div className="mb-2 font-semibold">Count of Active packs2</div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr>
            <th className="px-2 py-1 border">User</th>
            <th className="px-2 py-1 border">Assigned Date</th>
            <th className="px-2 py-1 border">Disabled Date</th>
            <th className="px-2 py-1 border">Data Pack Enabled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
            <td className="px-2 py-1 border">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function MarketingManagerPackage({ state, handleInput }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Marketing Manager Package Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white border rounded">
          {/* Package Type Row */}
          <div className="flex flex-row items-center mb-2">
            <div className="font-semibold min-w-[160px] text-right pr-2">Package Type</div>
            <select
              id="packageType"
              className="px-2 py-1 text-sm border rounded min-w-[260px]"
              value={state.packageType || "Trial"}
              onChange={e => handleInput("packageType", e.target.value)}
            >
              {packageTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="ml-4 text-sm">{packageTypeDescriptions[state.packageType || "Trial"]}</div>
          </div>

          {/* Data Pack Section (only for certain package types) */}
          {showDataPackTypes.includes(state.packageType) && (
            <>
              {/* Data Pack Type Row */}
              <div className="flex flex-row items-center mb-2">
                <div className="font-semibold min-w-[160px] text-right pr-2">Data Pack Type</div>
                <select
                  id="dataPackType"
                  className="px-2 py-1 text-sm border rounded min-w-[260px]"
                  value={state.dataPackType || "Basic"}
                  onChange={e => handleInput("dataPackType", e.target.value)}
                >
                  {dataPackTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.value} ({option.label} contact records per month)
                    </option>
                  ))}
                </select>
              </div>
              {/* Base Data Pack Count Row */}
              <div className="flex flex-row items-center mb-2">
                <div className="font-semibold min-w-[160px] text-right pr-2">Base Data Pack Count</div>
                <Input
                  id="baseDataPackCount"
                  type="number"
                  min={0}
                  className="w-16"
                  value={state.baseDataPackCount || 0}
                  onChange={e => handleInput("baseDataPackCount", parseInt(e.target.value, 10))}
                />
              </div>
              {/* Count of Data Packs charged for current month Row */}
              <div className="flex flex-row items-center mb-2">
                <div className="font-semibold min-w-[320px] text-right pr-2">Count of Data Packs charged for current month</div>
                <Input
                  id="countDataPacksCurrentMonth"
                  type="number"
                  min={0}
                  className="w-16"
                  value={state.countDataPacksCurrentMonth || 0}
                  disabled={true}
                />
              </div>
            </>
          )}

          {/* Links Row (center aligned) */}
          <div className="flex flex-row flex-wrap justify-center w-full gap-8 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Package and Data Pack Details applicable for next month
                </a>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Package and Data Pack Details applicable for next month</DialogTitle>
                </DialogHeader>
                <PackageDetailsTable />
              </DialogContent>
            </Dialog>
            {showDataPackTypes.includes(state.packageType) && (
              <Dialog>
                <DialogTrigger asChild>
                  <a href="#" className="text-sm text-blue-600 hover:underline">
                    Show users with data packs assigned
                  </a>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Users with Data Packs Assigned</DialogTitle>
                  </DialogHeader>
                  <UsersWithDataPacksTable />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 