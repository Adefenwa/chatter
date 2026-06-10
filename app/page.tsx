import { TrendingUp, House, User, Tag, Book, ListFilter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import PostFeed from "@/components/shared/PostFeed";
import FeedSkeleton from "@/components/shared/FeedSkeleton";
export default async function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
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
        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Your Feed</h1>
            <button className="text-white/50 cursor-pointer hover:text-white transition">
              <ListFilter strokeWidth={1.5} />
            </button>
          </div>
          <Suspense fallback={<FeedSkeleton />}>
            <PostFeed />
          </Suspense>
        </main>

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
    </div>
  );
}
