"use client";

import { Video } from "@/lib/types";
import VideoCard from "./VideoCard";

interface VideoSectionProps {
  videos: Video[];
}

export default function VideoSection({ videos }: VideoSectionProps) {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Nossos Vídeos
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Conheça mais sobre a ABCIP através dos nossos vídeos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

