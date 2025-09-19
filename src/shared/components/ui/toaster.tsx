import * as React from "react"
import { createPortal } from "react-dom"
import { Toast } from "./toast"
import { useToast } from "@/shared/hooks/useToast"

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>,
    document.body
  )
}