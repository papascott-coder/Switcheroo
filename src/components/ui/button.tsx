import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[opacity,transform,box-shadow] duration-quick ease-smooth disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg",
        paper: "btn-paper shadow-paper",
        ink: "bg-paper-ink text-paper",
        stamp: "bg-stamp text-paper",
        ghost: "bg-transparent text-fg hover:bg-elevated",
        outline: "text-fg shadow-border hover:shadow-border-hover",
      },
      size: {
        sm: "h-10 rounded-md px-3 text-sm",
        md: "h-12 rounded-md px-4 text-sm",
        lg: "h-14 rounded-lg px-5 text-base",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
