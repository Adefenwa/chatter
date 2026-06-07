"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  postId: string;
  initialLikeCount: number;
};

export default function ReaderActions({ postId, initialLikeCount }: Props) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const supabase = createClient();

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      setLikeCount((c) => c - 1);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: postId, user_id: user.id });
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  const handleBookmark = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase
        .from("bookmarks")
        .insert({ post_id: postId, user_id: user.id });
    }
    setBookmarked(!bookmarked);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleLike}
        className="flex flex-col items-center gap-1 text-white/30 hover:text-red-400 transition"
      >
        <span className={`text-xl ${liked ? "text-red-400" : ""}`}>♥</span>
        <span className="text-xs">{likeCount}</span>
      </button>
      <button className="text-white/30 hover:text-white/70 transition">
        <span className="text-xl">💬</span>
      </button>
      <button
        onClick={handleBookmark}
        className={`text-xl transition ${bookmarked ? "text-blue-400" : "text-white/30 hover:text-blue-400"}`}
      >
        🔖
      </button>
      <button className="text-white/30 hover:text-white/70 transition text-xl">
        ↗️
      </button>
    </div>
  );
}
