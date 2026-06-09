"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { Camera, NotebookText, Timer, Trash2 } from "lucide-react";

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
    if (title || content) {
      setSaveStatus("unsaved");
    }
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
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/10 px-6 py-3 flex items-center gap-4">
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Post"
            className="text-lg font-semibold bg-transparent focus:outline-none text-white placeholder-white/20"
          />
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span className="text-green-400">✓</span>
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
          {/* <button className="text-white/30 hover:text-white transition">
            ⬇️
          </button>
          <button className="text-white/30 hover:text-white transition">
            ⚙️
          </button> */}
          <button
            onClick={() => savePost("draft")}
            className="border border-white/20 text-white/70 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            Draft
          </button>
          <button
            onClick={handlePublish}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-1.5 rounded-lg hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </div>
      </header>

      {/* Editor + Settings */}
      <div className="flex flex-1">
        {/* Editor Area */}
        <main className="flex-1 px-8 py-8">
          <div data-color-mode="dark">
            <MDEditor
              value={content}
              onChange={(v) => setContent(v || "")}
              preview="edit"
              height={600}
              style={{
                background: "#0f172a",
                boxShadow: "none",
                border: "none",
              }}
              textareaProps={{ placeholder: "Start your story..." }}
            />
          </div>
        </main>

        {/* Settings Sidebar */}
        <aside className="w-72 bg-[#1e293b] border-l border-white/10 p-6 flex flex-col gap-6">
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              Settings
            </p>
            <p className="text-xs text-white/30 mt-0.5">
              Configure post metadata
            </p>
          </div>

          {/* Cover Image */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
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
                <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-white/20 hover:border-white/30 transition">
                  <span className="text-2xl">
                    <Camera strokeWidth={1.5} />
                  </span>
                  <span className="text-xs mt-1">Drag or Click to Upload</span>
                </div>
              )}
            </label>
          </div>

          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-200"
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
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {AVAILABLE_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className="text-xs text-white/30 hover:text-blue-400 hover:bg-blue-400/10 px-2 py-0.5 rounded-full transition"
                >
                  +{tag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/40 space-y-1">
            <div className="flex items-center gap-4">
              <span>
                <Timer strokeWidth={1.5} />{" "}
              </span>
              <span>Est. Read Time: {readTime} min</span>
            </div>
            <div className="flex items-center gap-4">
              <span>
                <NotebookText strokeWidth={1.5} />
              </span>
              <span>Words: {wordCount}</span>
            </div>
          </div>

          <button
            onClick={handleDeleteDraft}
            className="flex items-center gap-2 text-red-400 cursor-pointer hover:text-red-300 text-sm mt-auto transition"
          >
            <Trash2 strokeWidth={1.5} /> Delete Draft
          </button>
        </aside>
      </div>
    </div>
  );
}
