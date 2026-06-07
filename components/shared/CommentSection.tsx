"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: { full_name: string; avatar_url: string | null; username: string };
  replies?: Comment[];
};

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const supabase = createClient();

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*, author:profiles(full_name, avatar_url, username)")
      .eq("post_id", postId)
      .is("parent_id", null)
      .order("created_at", { ascending: false });
    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      content: newComment,
      parent_id: null,
    });
    setNewComment("");
    fetchComments();
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      content: replyContent,
      parent_id: parentId,
    });
    setReplyContent("");
    setReplyTo(null);
    fetchComments();
  };

  return (
    <section className="mt-16 pt-8 border-t border-gray-100">
      <h2 className="text-2xl font-bold text-[#0f172a] mb-6">
        Responses ({comments.length})
      </h2>

      {/* Comment Input */}
      <div className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleComment}
            className="bg-[#0f172a] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#1e293b] transition"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex gap-3">
              <Image
                src={
                  comment.author?.avatar_url ||
                  `https://i.pravatar.cc/36?u=${comment.author?.username}`
                }
                alt={comment.author?.full_name}
                className="w-9 h-9 rounded-full shrink-0"
                width={36}
                height={36}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {comment.author?.full_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comment.content}
                </p>
                <button
                  onClick={() =>
                    setReplyTo(replyTo === comment.id ? null : comment.id)
                  }
                  className="text-xs text-gray-400 hover:text-blue-600 mt-2 transition"
                >
                  Reply
                </button>

                {/* Reply Input */}
                {replyTo === comment.id && (
                  <div className="mt-3">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                      onClick={() => handleReply(comment.id)}
                      className="mt-1 text-xs bg-[#0f172a] text-white px-3 py-1.5 rounded-lg hover:bg-[#1e293b] transition"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
