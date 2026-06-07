"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author: { full_name: string; avatar_url: string | null; username: string };
};

type Props = {
  postId: string;
  initialComments: Comment[];
};

export default function CommentSection({ postId, initialComments }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const supabase = createClient();

  const handleComment = async () => {
    if (!newComment.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        author_id: user.id,
        content: newComment,
        parent_id: null,
      })
      .select("*, author:profiles(full_name, avatar_url, username)")
      .single();

    if (data) setComments([data, ...comments]);
    setNewComment("");
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
  };

  return (
    <section className="mt-16 pt-8 border-t border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">
        Responses ({comments.length})
      </h2>

      <div className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What are your thoughts?"
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleComment}
            className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={
                comment.author?.avatar_url ||
                `https://i.pravatar.cc/36?u=${comment.author?.username}`
              }
              alt={comment.author?.full_name}
              className="w-9 h-9 rounded-full shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-white">
                  {comment.author?.full_name}
                </span>
                <span className="text-xs text-white/30">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {comment.content}
              </p>
              <button
                onClick={() =>
                  setReplyTo(replyTo === comment.id ? null : comment.id)
                }
                className="text-xs text-white/30 hover:text-blue-400 mt-2 transition"
              >
                Reply
              </button>

              {replyTo === comment.id && (
                <div className="mt-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="mt-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Reply
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
