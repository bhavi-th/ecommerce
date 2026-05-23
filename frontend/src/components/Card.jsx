import { cn } from "../utils/cn"
import { forwardRef } from "react"

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))

const CardHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 p-4 md:p-6", className)}
    {...props}
  />
)

const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
)

const CardDescription = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-4 md:p-6 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div
    className={cn("flex items-center p-4 md:p-6 pt-0", className)}
    {...props}
  />
)

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
