
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'pastel';
    pastelIndex?: number;
  }
>(({ className, size = 'medium', variant = 'default', pastelIndex = 0, style, ...props }, ref) => {
  const sizeStyles = {
    small: 'shadow-sm hover:shadow-md',
    medium: 'shadow-sm hover:shadow-md',
    large: 'shadow-sm hover:shadow-md'
  };

  // Ensure consistent white background and proper spacing
  const backgroundClass = 'bg-white';

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg text-card-foreground transition-all duration-200",
        backgroundClass,
        sizeStyles[size],
        // Ensure proper border for all cards
        "border border-gray-200",
        className
      )}
      style={style}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight",
      // Use black for card titles as per design system
      "text-black",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter }
