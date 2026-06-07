"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ReaderActions({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchCounts = async () => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("post_id", postId);
      setLikeCount(count || 0);
    };
    fetchCounts();
  }, [postId, supabase]);

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
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-500 transition"
      >
        <span className={`text-xl ${liked ? "text-red-500" : ""}`}>♥</span>
        <span className="text-xs">{likeCount}</span>
      </button>
      <button className="text-gray-400 hover:text-gray-700 transition">
        <span className="text-xl">💬</span>
      </button>
      <button
        onClick={handleBookmark}
        className={`text-xl transition ${bookmarked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`}
      >
        🔖
      </button>
      <button className="text-gray-400 hover:text-gray-700 transition text-xl">
        ↗️
      </button>
    </div>
  );
}
