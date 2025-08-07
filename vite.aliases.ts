import path from 'path'
import type { AliasOptions } from 'vite'

export const aliases: AliasOptions = {
  '@': path.resolve(__dirname, 'src'),
  '@OpportunityUtils': path.resolve(__dirname, 'src/features/Opportunity/utils'),
  '@OpportunityConstants': path.resolve(__dirname, 'src/features/Opportunity/constants'),
  '@OpportunityContexts': path.resolve(__dirname, 'src/features/Opportunity/contexts'),
  '@OpportunityComponents': path.resolve(__dirname, 'src/features/Opportunity/components'),
  '@OpportunityServices': path.resolve(__dirname, 'src/features/Opportunity/services'),
  '@OpportunityData': path.resolve(__dirname, 'src/features/Opportunity/data'),
}