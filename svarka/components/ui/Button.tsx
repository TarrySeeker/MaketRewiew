import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-heading",
    {
        variants: {
            variant: {
                default: "bg-industry-accent text-industry-900 hover:bg-industry-accent/90 shadow-[0_0_15px_rgba(255,153,0,0.3)] hover:shadow-[0_0_25px_rgba(255,153,0,0.5)] border border-industry-accent",
                destructive:
                    "bg-red-900 text-red-50 hover:bg-red-900/90 border border-red-700",
                outline:
                    "border border-industry-600 bg-transparent hover:bg-industry-800 text-foreground hover:text-industry-accent hover:border-industry-accent",
                secondary:
                    "bg-industry-700 text-foreground hover:bg-industry-600 border border-industry-600",
                ghost: "hover:bg-industry-800 hover:text-industry-accent",
                link: "text-industry-accent underline-offset-4 hover:underline",
                neon: "bg-industry-neon text-industry-900 hover:bg-industry-neon/90 shadow-[0_0_15px_rgba(204,255,0,0.3)] border border-industry-neon",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-12 rounded-md px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
