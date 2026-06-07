import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReaderActions from "@/components/shared/ReaderActions";
import CommentSection from "@/components/shared/CommentSection";

type Props = {
  params: { username: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", params.slug)
    .single();

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image ? [{ url: post.cover_image }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:profiles(id, username, full_name, avatar_url, bio)")
    .eq("slug", params.slug)
    .single();

  if (!post) notFound();

  const { data: recommendedPosts } = await supabase
    .from("posts")
    .select("title, slug, author:profiles(username)")
    .eq("status", "published")
    .neq("id", post.id)
    .limit(4);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-[#0f172a]">
            Chatter
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Feed
            </Link>
            <Link
              href="/write"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Write
            </Link>
            <Link
              href="/library"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Library
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-[#0f172a] text-white text-sm px-4 py-1.5 rounded-lg hover:bg-[#1e293b] transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {post.cover_image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
            width={800}
            height={450}
          />
        </div>
      )}

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
        {/* Left Actions - sticky */}
        <aside className="hidden lg:flex flex-col items-center gap-6 w-10 shrink-0 sticky top-24 h-fit">
          <ReaderActions postId={post.id} />
        </aside>

        {/* Article */}
        <article className="flex-1 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] leading-tight mb-4">
            {post.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <Image
              src={
                post.author?.avatar_url ||
                `https://i.pravatar.cc/40?u=${post.author?.username}`
              }
              alt={post.author?.full_name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/${post.author?.username}`}
                  className="text-sm font-semibold text-gray-900 hover:underline"
                >
                  {post.author?.full_name}
                </Link>
                <span className="text-xs text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full">
                  Follow
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {post.read_time && ` · ${post.read_time} min read`}
              </p>
            </div>
            <button className="ml-auto text-gray-300 hover:text-gray-500">
              •••
            </button>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#0f172a] prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-code:bg-gray-900 prose-code:text-green-400 prose-pre:bg-gray-900 prose-pre:text-green-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comment Section */}
          <CommentSection postId={post.id} />
        </article>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              About the Author
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {post.author?.bio || "Writer on Chatter."}
            </p>
            <Link
              href={`/${post.author?.username}`}
              className="block text-center mt-4 bg-[#0f172a] text-white text-sm py-2 rounded-lg hover:bg-[#1e293b] transition"
            >
              Full Profile
            </Link>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Recommended Stories
            </p>
            <div className="flex flex-col gap-4">
              {recommendedPosts?.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/${rec.author?.username}/${rec.slug}`}
                  className="group"
                >
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition leading-snug">
                    {rec.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white px-6 py-10 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xl font-bold">Chatter</span>
          <div className="flex gap-6 text-sm text-white/50">
            {["About", "Help", "Privacy", "Terms", "Blog"].map((link) => (
              <Link
                key={link}
                href={`/${link.toLowerCase()}`}
                className="hover:text-white transition"
              >
                {link}
              </Link>
            ))}
          </div>
          <p className="text-sm text-white/30">
            © 2024 Chatter Publishing. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-100 flex items-center justify-around py-3">
        {[
          { label: "Home", icon: "🏠", href: "/" },
          { label: "Explore", icon: "🔍", href: "/explore" },
          { label: "Bookmarks", icon: "🔖", href: "/bookmarks" },
          { label: "Profile", icon: "👤", href: "/profile" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-900 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
