
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Add lovable color scheme variants
        blue: "bg-blue-500 hover:bg-blue-600 text-white",
        green: "bg-green-600 hover:bg-green-700 text-white",
        red: "bg-red-600 hover:bg-red-700 text-white",
        yellow: "bg-amber-500 hover:bg-amber-600 text-white",
        orange: "bg-orange-500 hover:bg-orange-600 text-white",
        purple: "bg-purple-500 hover:bg-purple-600 text-white",
        pink: "bg-pink-500 hover:bg-pink-600 text-white",
        indigo: "bg-indigo-500 hover:bg-indigo-600 text-white",
        gray: "bg-gray-500 hover:bg-gray-600 text-white",
        // Primary lovable color
        lovable: "bg-[#1a4d80] hover:bg-[#1a4d80]/90 text-white",
        // Secondary lovable color
        sky: "bg-[#4fb3ff] hover:bg-[#4fb3ff]/90 text-white",
        // Custom status variants with better contrast
        open: "border-transparent bg-blue-300 text-gray-800 hover:bg-blue-400",
        won: "border-transparent bg-green-500 text-white hover:bg-green-600",
        lost: "border-transparent bg-red-500 text-white hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
