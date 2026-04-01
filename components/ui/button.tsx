import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-[4px] focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(16,39,32,0.18)] hover:-translate-y-0.5 hover:bg-[color:var(--forest-layer)]",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-primary/16 bg-white/75 text-primary shadow-[0_10px_24px_rgba(16,39,32,0.06)] hover:border-primary/28 hover:bg-white",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost: "text-primary hover:bg-primary/8 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "min-h-10 gap-1.5 px-4 text-sm has-[>svg]:px-3.5",
        lg: "min-h-13 px-7 text-base has-[>svg]:px-5",
        icon: "size-11",
        "icon-sm": "size-10",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
