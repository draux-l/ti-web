"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TabsProps extends React.ComponentProps<"div"> {
  value: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            typeof child === "object" &&
            "type" in child &&
            (child as React.ReactElement).type === TabsList
          ) {
            return React.cloneElement(child as React.ReactElement<{
              value?: string
              onValueChange?: (value: string) => void
            }>, { value, onValueChange })
          }
          return null
        })}
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            typeof child === "object" &&
            "type" in child &&
            (child as React.ReactElement).type === TabsContent
          ) {
            return child
          }
          return null
        })}
      </div>
    )
  }
)
Tabs.displayName = "Tabs"

interface TabsListProps extends React.ComponentProps<"div"> {
  value?: string
  onValueChange?: (value: string) => void
}

function TabsList({
  className,
  children,
  onValueChange,
}: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          typeof child === "object" &&
          "type" in child &&
          (child as React.ReactElement).type === TabsTrigger
        ) {
          return child
        }
        return null
      })}
    </div>
  )
}

interface TabsTriggerProps extends React.ComponentProps<"button"> {
  value: string
}

function TabsTrigger({
  className,
  disabled,
  children,
  value,
  onClick,
}: TabsTriggerProps) {
  return (
    <button
      type="button"
      role="tab"
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps extends React.ComponentProps<"div"> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${value}-tab`}
        tabIndex={0}
        className={cn("focus-visible:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }