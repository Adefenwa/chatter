import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ExplorePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const supabase = await createClient();

  // Fetch posts based on search query
  const postsQuery = supabase
    .from("posts")
    .select(
      "*, author:profiles!posts_author_id_fkey(username, full_name, avatar_url)",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const { data: posts } = q
    ? await postsQuery.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`)
    : await postsQuery.limit(20);

  // Fetch all tags
  const { data: tags } = await supabase.from("tags").select("*").limit(20);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Explore</h1>
          <form>
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search posts by title or content..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Tags */}
        {!q && tags && tags.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4">
              Browse by Topic
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/explore?q=${tag.name}`}
                  className="text-sm text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 px-3 py-1.5 rounded-full transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest">
            {q ? `Results for "${q}"` : "Latest Posts"}
          </h2>
          <span className="text-xs text-white/30">
            {posts?.length || 0} posts
          </span>
        </div>

        {/* Posts Grid */}
        {posts && posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">No posts found for "{q}"</p>
            <Link
              href="/explore"
              className="text-blue-400 text-sm hover:underline mt-2 block"
            >
              Clear search
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts?.map((post) => (
            <Link
              key={post.id}
              href={`/${(post.author as { username: string })?.username}/${post.slug}`}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition"
            >
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-white group-hover:text-blue-400 transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-white/50 mt-1 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={
                      (
                        post.author as {
                          avatar_url: string | null;
                          username: string;
                        }
                      )?.avatar_url ||
                      `https://i.pravatar.cc/24?u=${(post.author as { username: string })?.username}`
                    }
                    alt="author"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-white/40">
                    {(post.author as { full_name: string })?.full_name}
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
      </div>
    </div>
  );
}
