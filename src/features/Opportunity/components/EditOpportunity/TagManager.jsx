
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Plus, Tag, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const TagManager = ({ tags = "", onTagsChange }) => {
  const [customTag, setCustomTag] = useState("");
  const [open, setOpen] = useState(false);
  
  // Parse existing tags
  const currentTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  // Get all available tags from categories
  const allCategoryTags = Object.values(TAG_CATEGORIES).flatMap(category => category.tags);

  const addTag = (tag) => {
    if (tag && !currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      onTagsChange(newTags.join(', '));
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    onTagsChange(newTags.join(', '));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  const getTagColor = (tag) => {
    for (const [key, category] of Object.entries(TAG_CATEGORIES)) {
      if (category.tags.includes(tag)) {
        return category.color;
      }
    }
    return "gray";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </Label>
        
        {/* Display current tags */}
        <div className="flex flex-wrap gap-2 min-h-[2rem] p-2 border rounded-md bg-gray-50">
          {currentTags.length > 0 ? (
            currentTags.map((tag, index) => (
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
            <span className="text-gray-400 text-sm">No tags added</span>
          )}
        </div>
      </div>

      {/* Modern tag selector using Command component */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Add Tags</Label>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between h-8"
            >
              <span className="text-sm">Select tags from categories...</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." className="h-8" />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                {Object.entries(TAG_CATEGORIES).map(([key, category]) => (
                  <CommandGroup key={key} heading={category.name}>
                    {category.tags.map((tag) => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => {
                          addTag(tag);
                          setOpen(false);
                        }}
                        disabled={currentTags.includes(tag)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentTags.includes(tag) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <Badge variant={category.color} className="mr-2 text-xs">
                          {category.name}
                        </Badge>
                        {tag}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Custom tag input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Add Custom Tag</Label>
        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter custom tag"
            className="h-8"
            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
          />
          <Button 
            onClick={addCustomTag}
            size="sm"
            className="h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tag categories reference */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <Label className="text-sm font-medium text-blue-800 mb-2 block">Tag Categories Reference</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {Object.entries(TAG_CATEGORIES).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2">
              <Badge variant={category.color} className="text-xs">
                {category.name}
              </Badge>
              <span className="text-gray-600">
                {category.tags.slice(0, 2).join(', ')}
                {category.tags.length > 2 && '...'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagManager;
