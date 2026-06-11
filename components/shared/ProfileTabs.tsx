"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  slug: string;
  read_time: number | null;
  created_at: string;
};

type Bookmark = {
  id: string;
  post: Post & {
    author: { username: string; full_name: string; avatar_url: string | null };
  };
};

type Props = {
  posts: Post[];
  bookmarks: Bookmark[];
  profileId: string;
};

const TABS = ["Published Posts", "Bookmarks", "Analytics"];

export default function ProfileTabs({ posts, bookmarks }: Props) {
  const [activeTab, setActiveTab] = useState("Published Posts");

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex items-center gap-6 border-b border-white/10 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium pb-3 border-b-2 transition ${
              activeTab === tab
                ? "text-white border-blue-500"
                : "text-white/40 border-transparent hover:text-white/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Published Posts */}
      {activeTab === "Published Posts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 && (
            <p className="text-white/30 text-sm col-span-3">
              No published posts yet.
            </p>
          )}
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`#`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
            >
              {post.cover_image && (
                <div className="relative">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    width={400}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide">
                    Technology
                  </span>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-white/40 mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-white/30">
                    {post.read_time && `${post.read_time} min read`}
                  </span>
                  <span className="text-xs text-white/30">
                    {new Date(post.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bookmarks */}
      {activeTab === "Bookmarks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.length === 0 && (
            <p className="text-white/30 text-sm col-span-3">
              No bookmarks yet.
            </p>
          )}
          {bookmarks.map((bookmark) => (
            <Link
              key={bookmark.id}
              href={`/${bookmark.post?.author?.username}/${bookmark.post?.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
            >
              {bookmark.post?.cover_image && (
                <Image
                  src={bookmark.post.cover_image}
                  alt={bookmark.post.title}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition line-clamp-2">
                  {bookmark.post?.title}
                </h3>
                <p className="text-xs text-white/40 mt-1">
                  {bookmark.post?.author?.full_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "Analytics" && (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm mb-4">
            View your full analytics dashboard
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-2 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}
