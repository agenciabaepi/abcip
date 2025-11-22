"use client";

import { useState, useEffect } from "react";
import { Eye, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, MessageCircle } from "lucide-react";

interface PostStatsProps {
  postId: string;
  initialViews: number;
  initialLikes: number;
  initialShares: number;
  shareUrl: string;
  shareTitle: string;
  shareDescription?: string;
}

export default function PostStats({
  postId,
  initialViews,
  initialLikes,
  initialShares,
  shareUrl,
  shareTitle,
  shareDescription,
}: PostStatsProps) {
  const [views, setViews] = useState(initialViews);
  const [shares, setShares] = useState(initialShares);
  const [currentUrl, setCurrentUrl] = useState(shareUrl);

  useEffect(() => {
    if (typeof window !== "undefined" && !shareUrl.includes("http")) {
      setCurrentUrl(`${window.location.origin}${shareUrl}`);
    }
  }, [shareUrl]);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        await fetch(`/api/posts/${postId}/views`, { method: "POST" });
        setViews((prev) => prev + 1);
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };
    incrementViews();
  }, [postId]);

  const handleShare = async (platform: string) => {
    try {
      await fetch(`/api/posts/${postId}/share`, { method: "POST" });
      setShares((prev) => prev + 1);
    } catch (error) {
      console.error("Error counting share:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copiado para a área de transferência!");
      await handleShare("copy");
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-600">
          <Eye className="w-5 h-5" />
          <span className="font-medium">{views}</span>
          <span className="text-sm text-gray-500">visualizações</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Share2 className="w-5 h-5" />
          <span className="font-medium">{shares}</span>
          <span className="text-sm text-gray-500">compartilhamentos</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-gray-200">
        <span className="text-sm font-medium text-gray-700">Compartilhar:</span>
        <div className="flex items-center gap-2">
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare("facebook")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label="Compartilhar no Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare("twitter")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
            aria-label="Compartilhar no Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare("linkedin")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
            aria-label="Compartilhar no LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShare("whatsapp")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
            aria-label="Compartilhar no WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition"
            aria-label="Copiar link"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
