import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function BookmarksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(
      "*, post:posts!bookmarks_post_id_fkey(*, author:profiles!posts_author_id_fkey(username, full_name, avatar_url))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-8">Saved Posts</h1>

        {bookmarks && bookmarks.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">No bookmarks yet.</p>
            <Link
              href="/"
              className="text-blue-400 text-sm hover:underline mt-2 block"
            >
              Browse the feed
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks?.map((bookmark) => {
            const post = bookmark.post as {
              id: string;
              title: string;
              excerpt: string;
              cover_image: string | null;
              slug: string;
              read_time: number | null;
              created_at: string;
              author: {
                username: string;
                full_name: string;
                avatar_url: string | null;
              };
            };

            if (!post) return null;

            return (
              <Link
                key={bookmark.id}
                href={`/${post.author?.username}/${post.slug}`}
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
                        post.author?.avatar_url ||
                        `https://i.pravatar.cc/24?u=${post.author?.username}`
                      }
                      alt={post.author?.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-white/40">
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
