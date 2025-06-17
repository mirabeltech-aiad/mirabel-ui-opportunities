import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { separatorOptions, pickupOptions } from '../helpers/configData';

export function PickupFromSection({ pickupState = {}, handlePickupInput }) {
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