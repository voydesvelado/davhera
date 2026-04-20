"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ImageWithSkeleton({ className, fill, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (fill) {
    return (
      <div className="absolute inset-0">
        {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <Image
          fill
          {...props}
          className={className}
          onLoad={() => setLoaded(true)}
          style={{ ...(props.style ?? {}), opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {!loaded && (
        <Skeleton className="absolute inset-0 rounded-none" style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }} />
      )}
      <Image
        {...props}
        className={className}
        onLoad={() => setLoaded(true)}
        style={{ ...(props.style ?? {}), opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
