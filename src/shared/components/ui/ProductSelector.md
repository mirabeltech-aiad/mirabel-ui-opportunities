# ProductSelector Component

A drag-and-drop product selection component with capsule-style elements for intuitive product management.

## Features

- **Drag & Drop Reordering**: Selected products can be reordered by dragging
- **Capsule Design**: Clean, modern capsule-style product cards
- **Search & Filter**: Real-time search through available products
- **Selection Limits**: Optional maximum selection constraints
- **Type Indicators**: Product type badges for quick identification
- **Easy Management**: One-click add/remove with clear visual feedback

## Usage

```tsx
import { ProductSelector, ProductItem } from '@/shared/components/ui/ProductSelector'

const MyComponent = () => {
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([])
  
  const availableProducts: ProductItem[] = [
    { id: '1', name: 'Product A', type: 'CPM', status: 'Active' },
    { id: '2', name: 'Product B', type: 'Print', status: 'Active' },
    // ... more products
  ]

  return (
    <ProductSelector
      selectedProducts={selectedProducts}
      availableProducts={availableProducts}
      onSelectionChange={setSelectedProducts}
      label="Choose Products"
      placeholder="Search for products..."
      maxSelections={5} // Optional limit
    />
  )
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedProducts` | `ProductItem[]` | Yes | Array of currently selected products |
| `availableProducts` | `ProductItem[]` | Yes | Array of all available products to choose from |
| `onSelectionChange` | `(products: ProductItem[]) => void` | Yes | Callback when selection changes |
| `label` | `string` | No | Label for the component (default: "Select Products") |
| `placeholder` | `string` | No | Search input placeholder (default: "Search products...") |
| `maxSelections` | `number` | No | Maximum number of products that can be selected |
| `className` | `string` | No | Additional CSS classes |

## ProductItem Interface

```tsx
interface ProductItem {
  id: string        // Unique identifier
  name: string      // Display name
  type?: string     // Product type (shown as badge)
  status?: string   // Product status
}
```

## Sections

### Selected Products (Top)
- Shows currently selected products as draggable capsules
- Drag the grip handle to reorder
- Click the X button to remove
- Empty state shows helpful message

### Available Products (Bottom)
- Shows all available products (excluding already selected)
- Search functionality to filter products
- Click the + button to add to selection
- Scrollable area for large product lists

## Styling

The component uses Tailwind CSS classes and follows the design system:
- Ocean blue theme for selected items
- Gray theme for available items
- Smooth transitions and hover effects
- Responsive design for mobile and desktop

## Dependencies

- `@dnd-kit/core` - Core drag and drop functionality
- `@dnd-kit/sortable` - Sortable list implementation
- `@dnd-kit/utilities` - Utility functions for drag and drop

## Usage

The ProductSelector is currently used in the Rate Card Edit page for selecting products to associate with rate cards.