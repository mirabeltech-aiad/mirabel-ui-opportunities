
import React, { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronDown, X } from "lucide-react";

// Extracted constant for clarity
const TAG_CATEGORIES = {
  priority: {
    name: "Priority",
    color: "red",
    tags: ["hot-lead", "urgent", "high-value", "enterprise", "strategic"]
  },
  source: {
    name: "Source",
    color: "blue", 
    tags: ["referral", "inbound", "cold-outreach", "event", "partner", "website"]
  },
  industry: {
    name: "Industry",
    color: "green",
    tags: ["fintech", "healthcare", "education", "retail", "manufacturing", "saas"]
  },
  stage: {
    name: "Stage Qualifier",
    color: "purple",
    tags: ["decision-maker-identified", "budget-confirmed", "timeline-set", "competitor-analysis"]
  },
  product: {
    name: "Product Interest",
    color: "orange",
    tags: ["enterprise-solution", "starter-package", "custom-integration", "add-on-services"]
  },
  risk: {
    name: "Risk Assessment",
    color: "yellow",
    tags: ["low-risk", "medium-risk", "high-risk", "competitive-threat", "budget-constraints"]
  }
};

const TagSelector = ({ handleSelectChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  // Preserved exact function behavior
  const handleTagSelect = (tag) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        const newTags = current.filter((t) => t !== tag);
        handleSelectChange("tags", newTags);
        return newTags;
      } else {
        const newTags = [...current, tag];
        handleSelectChange("tags", newTags);
        return newTags;
      }
    });
  };

  // Preserved exact function behavior
  const removeTag = (tagToRemove) => {
    setSelectedTags((current) => {
      const newTags = current.filter((tag) => tag !== tagToRemove);
      handleSelectChange("tags", newTags);
      return newTags;
    });
  };

  // Preserved exact function behavior
  const getTagColor = (tag) => {
    for (const [key, category] of Object.entries(TAG_CATEGORIES)) {
      if (category.tags.includes(tag)) {
        return category.color;
      }
    }
    return "gray";
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      
      {/* Selected tags display - exact same structure */}
      <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 border rounded-md bg-gray-50">
        {selectedTags.length > 0 ? (
          selectedTags.map((tag, index) => (
            <Badge 
              key={index} 
              variant={getTagColor(tag)}
              className="flex items-center gap-1"
            >
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer hover:bg-black/10 rounded" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))
        ) : (
          <span className="text-gray-400 text-sm">Select tags to filter by</span>
        )}
      </div>

      {/* Tag selector dropdown - exact same structure */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <span className="truncate">
              Add tags to filter
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[300px] max-h-60 overflow-y-auto" align="start">
          {Object.entries(TAG_CATEGORIES).map(([categoryKey, category]) => (
            <div key={categoryKey}>
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100">
                {category.name}
              </div>
              {category.tags.map((tag) => (
                <DropdownMenuItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => handleTagSelect(tag)}
                  className="capitalize"
                >
                  {tag.replace(/-/g, ' ')}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TagSelector;
