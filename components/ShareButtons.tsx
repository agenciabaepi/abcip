"use client";

import { useState, useEffect } from "react";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Whatsapp } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  postId: string;
  onShare?: () => void;
}

export default function ShareButtons({ url, title, description, postId, onShare }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== "undefined" && !url.includes("http")) {
      setCurrentUrl(`${window.location.origin}${url}`);
    }
  }, [url]);
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  const handleShare = async (platform: string) => {
    // Conta o compartilhamento
    try {
      await fetch(`/api/posts/${postId}/share`, {
        method: "POST",
      });
      if (onShare) onShare();
    } catch (error) {
      console.error("Error counting share:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert("Link copiado para a área de transferência!");
      // Conta como compartilhamento também
      await handleShare("copy");
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
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
          <Whatsapp className="w-5 h-5" />
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
  );
}

