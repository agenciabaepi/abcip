"use client";

import { useState } from "react";
import { Video } from "@/lib/types";
import { extractYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/utils";
import { Play } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(video.youtube_url);
  const thumbnailUrl = video.thumbnail_url || (videoId ? getYouTubeThumbnail(videoId, 'maxres') : null);
  const embedUrl = videoId ? getYouTubeEmbedUrl(videoId) : null;

  if (!videoId || !embedUrl) {
    return null;
  }

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative aspect-video bg-gray-900">
        {!isPlaying ? (
          <>
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Botão de play centralizado */}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center group/play"
              aria-label={`Reproduzir ${video.title}`}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover/play:bg-white group-hover/play:scale-110 transition-all duration-300">
                  <Play className="w-10 h-10 text-[#031C30] ml-1" fill="currentColor" />
                </div>
                {/* Anel animado */}
                <div className="absolute inset-0 w-20 h-20 border-4 border-white/50 rounded-full animate-ping" />
              </div>
            </button>
          </>
        ) : (
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
      
      {/* Informações do vídeo */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
}

