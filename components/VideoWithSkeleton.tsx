"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoWithSkeletonProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  className?: string;
}

export default function VideoWithSkeleton({ className, ...props }: VideoWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <video
        {...props}
        className={className}
        onCanPlay={() => setLoaded(true)}
        style={{ ...(props.style ?? {}), opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
