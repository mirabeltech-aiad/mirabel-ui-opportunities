
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { colorTokens, spacingTokens } from "@/styles/designTokens"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Ocean theme variants - Primary and Secondary system
        ocean: "bg-ocean-500 text-white hover:bg-ocean-600 border border-ocean-500 transition-all duration-200 shadow-sm hover:shadow-md",
        "ocean-secondary": "bg-ocean-100 text-ocean-800 hover:bg-ocean-200 border border-ocean-200 transition-all duration-200 shadow-sm hover:shadow-md",
        "ocean-outline": "border border-ocean-500 text-ocean-500 hover:bg-ocean-50 bg-transparent transition-all duration-200",
        "ocean-ghost": "text-ocean-600 hover:bg-ocean-50 hover:text-ocean-700 transition-all duration-200",
        // Semantic variants for consistent UX
        success: "bg-green-500 text-white hover:bg-green-600 border border-green-500 shadow-sm hover:shadow-md",
        "success-secondary": "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 shadow-sm hover:shadow-md",
        warning: "bg-amber-500 text-white hover:bg-amber-600 border border-amber-500 shadow-sm hover:shadow-md",
        "warning-secondary": "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 shadow-sm hover:shadow-md",
        error: "bg-red-500 text-white hover:bg-red-600 border border-red-500 shadow-sm hover:shadow-md",
        "error-secondary": "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 shadow-sm hover:shadow-md"
      },
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-md",
        sm: "h-9 px-3 py-1.5 text-sm rounded-sm",
        lg: "h-11 px-6 py-3 text-base rounded-lg", 
        icon: "h-10 w-10 rounded-md",
        "icon-sm": "h-9 w-9 rounded-sm",
        "icon-lg": "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
