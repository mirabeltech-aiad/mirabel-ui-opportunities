/**
 * @fileoverview Import Organization Standards
 * 
 * Standardizes import organization across all files
 */

// Import order priority
export const IMPORT_ORDER = {
  // 1. React and core libraries
  react: 1,
  // 2. External libraries (node_modules)
  external: 2,
  // 3. Internal absolute imports (@/)
  internal: 3,
  // 4. Relative imports (./)
  relative: 4,
} as const;

// Import grouping patterns
export const IMPORT_GROUPS = {
  react: /^(react|react-dom)/,
  external: /^[^@.]/,
  internal: /^@\//,
  relative: /^\.{1,2}\//,
} as const;

// Standard import organization template
export const IMPORT_TEMPLATE = `
// React and core libraries
import React from 'react';
import { useState, useEffect } from 'react';

// External libraries
import { clsx } from 'clsx';
import { toast } from 'sonner';

// Internal components and utilities
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Types and interfaces
import type { ComponentProps } from 'react';
import type { CustomType } from '@/types';

// Relative imports
import { localUtil } from './utils';
import { LocalComponent } from './LocalComponent';
`.trim();

// Import organization rules
export const IMPORT_RULES = {
  // Group imports by category
  grouping: true,
  // Sort imports within groups alphabetically
  alphabetical: true,
  // Separate groups with empty lines
  spacing: true,
  // Type imports should use 'type' keyword
  typeImports: true,
  // No unused imports
  noUnused: true,
} as const;

// Import validation function
export const validateImports = (imports: string[]) => {
  const groups = {
    react: [] as string[],
    external: [] as string[],
    internal: [] as string[],
    relative: [] as string[],
  };

  imports.forEach(importLine => {
    const fromMatch = importLine.match(/from ['"]([^'"]+)['"]/);
    if (!fromMatch) return;

    const source = fromMatch[1];

    if (IMPORT_GROUPS.react.test(source)) {
      groups.react.push(importLine);
    } else if (IMPORT_GROUPS.external.test(source)) {
      groups.external.push(importLine);
    } else if (IMPORT_GROUPS.internal.test(source)) {
      groups.internal.push(importLine);
    } else if (IMPORT_GROUPS.relative.test(source)) {
      groups.relative.push(importLine);
    }
  });

  return groups;
};

// Generate organized imports
export const organizeImports = (imports: string[]) => {
  const groups = validateImports(imports);
  const organized: string[] = [];

  // Add each group with proper spacing
  if (groups.react.length > 0) {
    organized.push(...groups.react.sort(), '');
  }

  if (groups.external.length > 0) {
    organized.push(...groups.external.sort(), '');
  }

  if (groups.internal.length > 0) {
    organized.push(...groups.internal.sort(), '');
  }

  if (groups.relative.length > 0) {
    organized.push(...groups.relative.sort());
  }

  return organized.filter(line => line !== '' || organized[organized.indexOf(line) + 1] !== '');
};