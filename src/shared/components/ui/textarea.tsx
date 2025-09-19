import * as React from "react"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  modal?: boolean; // Use compact modal styling
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", modal = false, ...props }, ref) => {
    const baseClass = modal ? 'form-field-modal' : 'form-field-base';
    return (
      <textarea
        className={`${baseClass} flex min-h-[80px] w-full placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }