"use client";

interface VideoThumbnailProps {
  src: string;
  alt: string;
  className?: string;
}

export default function VideoThumbnail({ src, alt, className = "" }: VideoThumbnailProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

