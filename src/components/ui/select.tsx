"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

interface SelectProps extends React.ComponentProps<"div"> {
  value?: string
  onValueChange?: (value: string) => void
}

function Select({
  className,
  children,
  value,
  onValueChange,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          typeof child === "object" &&
          "type" in child
        ) {
          return React.cloneElement(
            child as React.ReactElement<{
              isOpen?: boolean
              onOpenChange?: (open: boolean) => void
            }>,
            { isOpen, onOpenChange: setIsOpen }
          )
        }
        return null
      })}
    </div>
  )
}

interface SelectTriggerProps extends React.ComponentProps<"button"> {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  placeholder?: string
}

function SelectTrigger({
  className,
  children,
  isOpen,
  onOpenChange,
  placeholder,
  ...props
}: SelectTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => onOpenChange?.(!isOpen)}
      {...props}
    >
      <span className={children ? "" : "text-muted-foreground"}>
        {children || placeholder}
      </span>
      <ChevronDownIcon
        className={cn(
          "size-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

interface SelectValueProps {
  children?: React.ReactNode
  className?: string
}

function SelectValue({
  children,
  className,
}: SelectValueProps) {
  return (
    <span className={cn("flex-1 truncate", className)}>{children}</span>
  )
}

interface SelectContentProps {
  children?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

function SelectContent({
  className,
  children,
  isOpen,
  onOpenChange,
}: SelectContentProps) {
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-input bg-popover p-1 text-popover-foreground shadow-md",
          className
        )}
      >
        {children}
      </div>
    </>
  )
}

interface SelectItemProps {
  children?: React.ReactNode
  value: string
  onClick?: (value: string) => void
  className?: string
}

function SelectItem({
  className,
  children,
  value,
  onClick,
}: SelectItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={() => onClick?.(value)}
    >
      {children}
    </button>
  )
}

interface SelectGroupProps {
  children?: React.ReactNode
  label?: string
  className?: string
}

function SelectGroup({
  className,
  children,
  label,
}: SelectGroupProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      {children}
    </div>
  )
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
}