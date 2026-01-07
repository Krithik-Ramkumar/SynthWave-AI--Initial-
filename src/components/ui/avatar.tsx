"use client"

import * as React from "react"
import * as AvaterPrimitive from"@radix-ui/react-avatar"

import { cn } from "@/components/lib/utils"

const Avatar = React.forwardRef<
    React.ElementRef<typeof AvaterPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof AvaterPrimitive.Root> 
>(({ className, ...props }, ref) => (
    <AvaterPrimitive.Root
        ref={ref}
        className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
        )}    
        {...props}
    />
))
Avatar.displayName = AvaterPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
    React.ElementRef<typeof AvaterPrimitive.Image>,
    React.ComponentPropsWithoutRef<typeof AvaterPrimitive.Image>
>(({ className, ...props }, ref) => (
    <AvaterPrimitive.Image
        ref={ref}
        className={cn("aspect-square h-full w-full", className)}
        {...props}
    />
))
AvatarImage.displayName = AvaterPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
    React.ElementRef<typeof AvaterPrimitive.Fallback>,
    React.ComponentPropsWithoutRef<typeof AvaterPrimitive.Fallback>
>(({ className, ...props }, ref) => (
    <AvaterPrimitive.Fallback
        ref={ref}
        className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted",
            className
        )}
        {...props}
    />
))
AvatarFallback.displayName = AvaterPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }