import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReaderActions from "@/components/shared/ReaderActions";
import CommentSection from "@/components/shared/CommentSection";
import Image from "next/image";

type Props = {
  params: Promise<{ username: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image")
    .eq("slug", slug)
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
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, author:profiles(id, username, full_name, avatar_url, bio)")
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  // Fetch recommended posts
  const { data: recommendedPosts } = await supabase
    .from("posts")
    .select("title, slug, author:profiles!posts_author_id_fkey(username)")
    .eq("status", "published")
    .neq("id", post.id)
    .limit(4);

  // Fetch initial comments server-side
  const { data: initialComments } = await supabase
    .from("comments")
    .select("*, author:profiles(full_name, avatar_url, username)")
    .eq("post_id", post.id)
    .is("parent_id", null)
    .order("created_at", { ascending: false });

  // Fetch initial like count server-side
  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact" })
    .eq("post_id", post.id);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {post.cover_image && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <Image
            src={post.cover_image}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
        {/* Left Sticky Actions */}
        <aside className="hidden lg:flex flex-col items-center gap-6 w-10 shrink-0 sticky top-24 h-fit">
          <ReaderActions postId={post.id} initialLikeCount={likeCount || 0} />
        </aside>

        {/* Main Article */}
        <article className="flex-1 max-w-2xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>

          {/* Author Bar */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
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
                  className="text-sm font-semibold text-white hover:underline"
                >
                  {post.author?.full_name}
                </Link>
                <span className="text-xs text-blue-400 border border-blue-400/50 px-3.5 py-1.5 cursor-pointer rounded-full">
                  Follow
                </span>
              </div>
              <p className="text-xs text-white/40">
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {post.read_time && ` · ${post.read_time} min read`}
              </p>
            </div>
            <button className="ml-auto text-white/20 hover:text-white/50">
              •••
            </button>
          </div>

          {/* Article Body */}
          <div
            className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-headings:font-bold prose-p:text-white/70 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic prose-blockquote:text-white/70 prose-pre:bg-white/5 prose-pre:text-green-400 prose-code:bg-white/10 prose-code:text-blue-300 prose-code:px-1 prose-code:rounded prose-strong:text-white prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comment Section */}
          <CommentSection
            postId={post.id}
            initialComments={initialComments || []}
          />
        </article>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
          {/* About Author */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              About the Author
            </p>
            <p className="text-sm text-white/60 leading-relaxed">
              {post.author?.bio || "Writer on Chatter."}
            </p>
            <Link
              href={`/${post.author?.username}`}
              className="block text-center mt-4 bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Full Profile
            </Link>
          </div>

          {/* Recommended Stories */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">
              Recommended Stories
            </p>
            <div className="flex flex-col gap-4">
              {recommendedPosts?.map((rec) => (
                <Link
                  key={rec.slug}
                  href={`/${(rec.author as unknown as { username: string })?.username}/${rec.slug}`}
                  className="group"
                >
                  <p className="text-sm font-semibold text-white/80 group-hover:text-blue-400 transition leading-snug">
                    {rec.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
