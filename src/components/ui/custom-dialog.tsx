import * as React from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  children: React.ReactNode
  open?: boolean
  onClose: () => void
  title?: string
  className?: string
}

export function CustomDialog({ children, open, onClose, title, className }: CustomDialogProps) {
  const firstInputRef = React.useRef<HTMLInputElement>(null)
  const [showDialog, setShowDialog] = React.useState(open)

  React.useEffect(() => {
    setShowDialog(open)
  }, [open])

  React.useEffect(() => {
    if (showDialog) {
      // Focus the first input after dialog opens
      setTimeout(() => {
        firstInputRef.current?.focus()
      }, 100)
    }
  }, [showDialog])

  const handleClose = () => {
    setShowDialog(false)
    onClose()
  }

  return (
    <Dialog open={showDialog} onOpenChange={handleClose}>
      <DialogContent
        className={cn(
          "max-w-lg overflow-y-auto max-h-[90vh]",
          className
        )}
      >
        <DialogHeader>
          {title && (
            <DialogTitle className="text-xl font-semibold">
              {title}
            </DialogTitle>
          )}
          <div className="absolute right-4 top-4">
            <button
              onClick={handleClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // Check if the child component can accept refs
            const isRefable = typeof child.type === 'function' || 
                            typeof child.type === 'object' || 
                            child.type === 'input' || 
                            child.type === 'textarea' || 
                            child.type === 'select'

            if (isRefable) {
              return React.cloneElement(child as React.ReactElement<any>, {
                ref: firstInputRef
              })
            }
          }
          return child
        })}
      </DialogContent>
    </Dialog>
  )
}