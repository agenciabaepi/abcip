"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export default function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o usuário já curtiu (usando localStorage)
  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    setIsLiked(likedPosts.includes(postId));
  }, [postId]);

  const handleLike = async () => {
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
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
        isLiked
          ? "bg-red-100 text-red-600 cursor-not-allowed"
          : "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
      } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
      aria-label="Curtir notícia"
    >
      <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
      <span className="font-medium">{likes}</span>
    </button>
  );
}

