import { FieldDefinition } from '../types'

export const AVAILABLE_FIELDS: FieldDefinition[] = [
  { 
    key: 'name', 
    label: 'Schedule Name', 
    type: 'advanced-text',
    operations: [
      { value: 'set', label: 'Set to' },
      { value: 'prepend', label: 'Prepend text' },
      { value: 'append', label: 'Append text' }
    ]
  },
  { 
    key: 'date', 
    label: 'Publication Date', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'materialDue', 
    label: 'Material Due', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'contentReview', 
    label: 'Content Review', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'digitalAssetsDue', 
    label: 'Digital Assets Due', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'platformUpload', 
    label: 'Platform Upload', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'seoMetadataComplete', 
    label: 'SEO/Metadata Complete', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'socialMediaLaunch', 
    label: 'Social Media Launch', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'analyticsReview', 
    label: 'Analytics Review', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'accountingComplete', 
    label: 'Accounting Close', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { 
    key: 'onSaleDate', 
    label: 'Live Date', 
    type: 'advanced-date',
    operations: [
      { value: 'set', label: 'Set to specific date' },
      { value: 'add', label: 'Add time period' }
    ],
    units: ['days', 'weeks', 'months', 'years']
  },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'isActive', label: 'Status', type: 'boolean' }
]