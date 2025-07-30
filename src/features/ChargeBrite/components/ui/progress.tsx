
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    animated?: boolean;
  }
>(({ className, value, animated = false, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 bg-primary transition-all",
        animated && "animate-fade-in duration-1000 ease-out"
      )}
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
        ...(animated && {
          transitionProperty: 'transform',
          transitionDuration: '1s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
        })
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
