import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md", className)}
      style={{
        background: "linear-gradient(90deg, #e8e8e4 25%, #d4d4d0 50%, #e8e8e4 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.6s ease-in-out infinite",
      }}
      {...props}
    />
  )
}

export { Skeleton }
