"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface PostCardLikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function PostCardLikeButton({ postId, initialLikes }: PostCardLikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o usuário já curtiu (usando localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      setIsLiked(likedPosts.includes(postId));
    }
  }, [postId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === "undefined") return;

    // Verifica se já curtiu
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    if (likedPosts.includes(postId)) {
      toast.error("Você já curtiu esta notícia!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao curtir");
      }

      const data = await response.json();
      setLikes(data.likes);
      setIsLiked(true);

      // Salva no localStorage
      const updatedLikedPosts = [...likedPosts, postId];
      localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));

      toast.success("Curtida adicionada!");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Erro ao curtir notícia");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`flex items-center gap-1.5 transition ${
        isLiked
          ? "text-red-600 cursor-not-allowed"
          : "text-gray-500 hover:text-red-600"
      } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
      aria-label="Curtir notícia"
    >
      <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}

