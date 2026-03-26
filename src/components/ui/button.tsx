import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function buttonVariants({ variant = "default", size = "default", className }: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm": variant === "default",
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm": variant === "destructive",
      "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-sm": variant === "outline",
      "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
      "hover:bg-accent/10 hover:text-accent": variant === "ghost",
      "text-primary underline-offset-4 hover:underline": variant === "link",
      "h-11 px-5 py-2": size === "default",
      "h-9 rounded-lg px-3": size === "sm",
      "h-14 rounded-2xl px-8 text-lg": size === "lg",
      "h-11 w-11": size === "icon",
    },
    className
  );
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm": variant === "destructive",
            "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent shadow-sm": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
            "hover:bg-accent/10 hover:text-accent": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "h-11 px-5 py-2": size === "default",
            "h-9 rounded-lg px-3": size === "sm",
            "h-14 rounded-2xl px-8 text-lg": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
