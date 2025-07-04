
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Using ocean theme from knowledge base instead of default
        default: "bg-ocean-600 text-white hover:bg-ocean-700 rounded-lg",
        destructive: "bg-red-500 text-white hover:bg-red-600 rounded-lg",
        outline: "border border-ocean-500 bg-transparent text-ocean-600 hover:bg-ocean-50 rounded-lg",
        secondary: "bg-ocean-100 text-ocean-800 hover:bg-ocean-200 rounded-lg",
        ghost: "text-ocean-600 hover:bg-ocean-50 rounded-lg",
        link: "text-ocean-600 underline-offset-4 hover:underline",
        // Interactive buttons following knowledge base
        interactive: "bg-ocean-500 text-white hover:bg-ocean-600 border-ocean-500 rounded-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-lg",
        icon: "h-10 w-10",
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
