"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const AVAILABLE_TAGS = [
  "Writing",
  "Design",
  "Technology",
  "AI",
  "Business",
  "Culture",
  "Science",
  "Health",
];

function calculateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved",
  );
  const [postId, setPostId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = calculateReadTime(content);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const savePost = useCallback(
    async (publishStatus?: "draft" | "published") => {
      if (!title.trim()) return;
      setSaveStatus("saving");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const postData = {
        title,
        content,
        slug: generateSlug(title),
        status: publishStatus || status,
        read_time: readTime,
        author_id: user.id,
        excerpt: content.slice(0, 150).replace(/[#*`]/g, ""),
        cover_image: coverImage,
      };

      if (postId) {
        await supabase.from("posts").update(postData).eq("id", postId);
      } else {
        const { data } = await supabase
          .from("posts")
          .insert(postData)
          .select()
          .single();
        if (data) setPostId(data.id);
      }

      setSaveStatus("saved");
      if (publishStatus) setStatus(publishStatus);
    },
    [title, content, status, readTime, coverImage, postId, supabase],
  );

  // Autosave every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (title.trim()) savePost();
    }, 30000);
    return () => clearInterval(interval);
  }, [savePost, title]);

  // Mark unsaved on change
  useEffect(() => {
    setSaveStatus("unsaved");
  }, [title, content]);

  const handlePublish = async () => {
    await savePost("published");
    router.push("/");
  };

  const addTag = (tag: string) => {
    const cleaned = tag.replace("#", "").trim();
    if (cleaned && !tags.includes(cleaned) && tags.length < 5) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  const handleDeleteDraft = async () => {
    if (postId) {
      await supabase.from("posts").delete().eq("id", postId);
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-[#0f172a]">
          Chatter
        </Link>
        <div className="w-px h-6 bg-gray-200" />
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Post"
            className="text-lg font-semibold text-gray-400 bg-transparent focus:outline-none focus:text-gray-900 placeholder-gray-300"
          />
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span className="text-green-500">✓</span>
            <span>
              {saveStatus === "saving"
                ? "SAVING..."
                : saveStatus === "unsaved"
                  ? "UNSAVED"
                  : "SAVED"}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600 transition">
            ⬇️
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition">
            ⚙️
          </button>
          <button
            onClick={() => savePost("draft")}
            className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
          >
            Draft
          </button>
          <button
            onClick={handlePublish}
            className="bg-[#0f172a] text-white text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-[#1e293b] transition"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor + Settings */}
      <div className="flex flex-1">
        {/* Editor Area */}
        <main className="flex-1 px-8 py-8 max-w-4xl">
          <div data-color-mode="light">
            <MDEditor
              value={content}
              onChange={(v) => setContent(v || "")}
              preview="edit"
              height={600}
              style={{ background: "#f8f9fa", boxShadow: "none" }}
              textareaProps={{ placeholder: "Start your story..." }}
            />
          </div>
        </main>

        {/* Settings Sidebar */}
        <aside className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col gap-6">
          <div>
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Settings
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Configure post metadata
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Cover Image
            </p>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImage}
                className="hidden"
              />
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-32 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 transition">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs mt-1">Drag or Click to Upload</span>
                </div>
              )}
            </label>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTag(tagInput)}
              placeholder="Add tag..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {AVAILABLE_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded-full transition"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Links */}
          <div className="flex flex-col gap-2">
            {["Post Settings", "Metadata", "Visibility"].map((item) => (
              <button
                key={item}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 py-2 border-b border-gray-100 transition"
              >
                {item === "Post Settings"
                  ? "⚙️"
                  : item === "Metadata"
                    ? "📄"
                    : "👁️"}
                {item}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 space-y-1">
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>Est. Read Time: {readTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📄</span>
              <span>Words: {wordCount}</span>
            </div>
          </div>

          {/* Delete Draft */}
          <button
            onClick={handleDeleteDraft}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm mt-auto transition"
          >
            🗑️ Delete Draft
          </button>
        </aside>
      </div>
    </div>
  );
}
