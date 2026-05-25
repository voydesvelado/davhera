import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
);

const base =
  "inline-flex items-center justify-center font-sans font-medium tracking-[-0.005em] transition-colors duration-200 ease-out outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-fg/30 disabled:text-bg disabled:hover:bg-fg/30";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-fg hover:bg-accent-hover",
  secondary:
    "border border-border-token bg-transparent text-fg hover:bg-fg/5",
  ghost: "bg-transparent text-fg hover:bg-fg/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-body-sm rounded-md",
  md: "h-11 px-6 text-body rounded-md",
  lg: "h-14 px-8 text-body-lg rounded-md",
};

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    void _v; void _s; void _c; void _ch;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props as Extract<ButtonProps, { href?: undefined }> & { href?: undefined };
  void _v; void _s; void _c; void _ch; void _h;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
