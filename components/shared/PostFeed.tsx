import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";

export default async function PostFeed() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      "*, author:profiles!posts_author_id_fkey(username, full_name, avatar_url)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {posts?.map((post) => (
        <Link
          key={post.id}
          href={`/${post.author?.username}/${post.slug}`}
          className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl overflow-hidden transition"
        >
          {post.cover_image && (
            <div className="relative">
              <Image
                src={post.cover_image}
                alt={post.title}
                width={600}
                height={240}
                className="w-full h-48 object-cover"
              />
              <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wide">
                Technology
              </span>
            </div>
          )}
          <div className="p-4">
            <h2 className="font-bold text-white group-hover:text-blue-400 transition text-base leading-snug line-clamp-2">
              {post.title}
            </h2>
            <p className="text-sm text-white/50 mt-1.5 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Image
                src={
                  post.author?.avatar_url ||
                  `https://i.pravatar.cc/32?u=${post.author?.username}`
                }
                alt={post.author?.full_name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-xs text-white/50">
                {post.author?.full_name}
              </span>
              {post.read_time && (
                <span className="text-xs text-white/30 ml-auto">
                  {post.read_time} min read
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
