import { createClient } from "@/lib/supabase/server";
import {
  NotebookPen,
  Bell,
  TrendingUp,
  House,
  User,
  Tag,
  Book,
  ListFilter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*, author:profiles(username, full_name, avatar_url)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-white shrink-0">
            Chatter
          </Link>

          {/* Search - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search Chatter..."
              className="w-full bg-white/10 text-white placeholder-white/40 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <nav className="hidden md:flex items-center gap-10 ml-auto">
            <Link
              href="/explore"
              className="text-sm text-white/70 hover:text-white font-bold transition"
            >
              Explore
            </Link>
            <Link
              href="/bookmarks"
              className="text-sm text-white/70 font-bold hover:text-white transition"
            >
              Bookmarks
            </Link>
          </nav>

          <div className="flex items-center gap-7 ml-auto md:ml-0">
            <Link
              href="/write"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-1.5 rounded-full transition"
            >
              <NotebookPen strokeWidth={1.5} size={16} /> Write
            </Link>
            <button className="text-white/70 hover:text-white cursor-pointer transition">
              <Bell strokeWidth={1.5} size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer border border-white/20 overflow-hidden">
              <Image
                src="https://i.pravatar.cc/32"
                alt="avatar"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 w-52 shrink-0">
          {[
            { label: "Home", href: "/", icon: <House strokeWidth={1.5} /> },
            {
              label: "Trending",
              href: "/trending",
              icon: <TrendingUp strokeWidth={1.5} />,
            },
            {
              label: "Topics",
              href: "/topics",
              icon: <Tag strokeWidth={1.5} />,
            },
            {
              label: "Authors",
              href: "/authors",
              icon: <User strokeWidth={1.5} />,
            },
            {
              label: "Reading List",
              href: "/reading-list",
              icon: <Book strokeWidth={1.5} />,
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Go Premium Card */}
          <div className="mt-4 bg-blue-700/30 border border-blue-500/30 rounded-xl p-4">
            <p className="text-sm font-semibold text-white">Go Premium</p>
            <p className="text-xs text-white/60 mt-1">
              Unlock exclusive insights and unlimited reading.
            </p>
            <button className="mt-3 w-full bg-white text-blue-700 text-xs font-semibold py-1.5 rounded-lg cursor-pointer hover:bg-blue-50 transition">
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* Feed */}
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Your Feed</h1>
            <button className="text-white/50 cursor-pointer hover:text-white transition">
              <ListFilter strokeWidth={1.5} />
            </button>
          </div>

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
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
              Trending Topics
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
                <Link
                  key={tag}
                  href={`/topics/${tag.replace("#", "")}`}
                  className="text-xs text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 px-2.5 py-1 rounded-full transition"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-4">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">
              Suggested Authors
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { name: "Sarah Jenkins", role: "Author, UX Weekly" },
                { name: "David Chen", role: "Editor at The Post" },
                { name: "Maya Patel", role: "AI Researcher" },
              ].map((author) => (
                <div key={author.name} className="flex items-center gap-2">
                  <Image
                    src={`https://i.pravatar.cc/32?u=${author.name}`}
                    alt={author.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {author.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {author.role}
                    </p>
                  </div>
                  <button className="text-xs text-blue-400 cursor-pointer border border-blue-400/50 px-2 py-0.5 rounded-full hover:bg-blue-400/10 transition shrink-0">
                    Follow
                  </button>
                </div>
              ))}
            </div>
            <Link
              href="/authors"
              className="block text-center text-xs text-blue-400 hover:text-blue-300 mt-4 cursor-pointer transition"
            >
              View All
            </Link>
          </div>

          <div className="mt-4 text-xs text-white/20 space-y-1">
            <div className="flex flex-wrap gap-2">
              {["About", "Help", "Terms", "Privacy", "Advertising"].map(
                (link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    className="hover:text-white/50 transition"
                  >
                    {link}
                  </Link>
                ),
              )}
            </div>
            <p>© 2026 Sotunde Emmanuel</p>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0f172a] border-t border-white/10 flex items-center justify-around py-3 px-4">
        {[
          { label: "Home", href: "/", icon: <House strokeWidth={1.5} /> },
          {
            label: "Trending",
            href: "/trending",
            icon: <TrendingUp strokeWidth={1.5} />,
          },
          {
            label: "Topics",
            href: "/topics",
            icon: <Tag strokeWidth={1.5} />,
          },
          {
            label: "Authors",
            href: "/authors",
            icon: <User strokeWidth={1.5} />,
          },
          {
            label: "Reading List",
            href: "/reading-list",
            icon: <Book strokeWidth={1.5} />,
          },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center px-3 py-2.5 cursor-pointer rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
