import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles(username, full_name, avatar_url)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-2 w-48 shrink-0">
          <nav className="flex flex-col gap-1">
            {["Home", "Trending", "Topics", "Authors", "Reading List"].map(
              (item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
                >
                  {item}
                </Link>
              ),
            )}
          </nav>
        </aside>

        {/* Main Feed */}
        <section className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Feed</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/${post.author?.username}/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {post.cover_image && (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <img
                      src={
                        post.author?.avatar_url || "https://i.pravatar.cc/32"
                      }
                      alt={post.author?.full_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-xs text-gray-500">
                      {post.author?.full_name}
                    </span>
                    {post.read_time && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {post.read_time} min read
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              TRENDING TOPICS
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "#Technology",
                "#DesignSystem",
                "#WritersLife",
                "#AI",
                "#Minimalism",
                "#Strategy",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mt-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">
              SUGGESTED AUTHORS
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "Sarah Jenkins", role: "Author at Chatter" },
                { name: "David Chen", role: "Editor at The Post" },
                { name: "Maya Patel", role: "AI Researcher" },
              ].map((author) => (
                <div key={author.name} className="flex items-center gap-2">
                  <img
                    src={`https://i.pravatar.cc/32?u=${author.name}`}
                    alt={author.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {author.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {author.role}
                    </p>
                  </div>
                  <button className="text-xs text-blue-600 border border-blue-600 px-2 py-0.5 rounded-full hover:bg-blue-50 transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
