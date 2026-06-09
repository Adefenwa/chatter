import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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
import LogoutButton from "@/components/shared/LogoutButton";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, avatar_url, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          Chatter
        </Link>

        {/* Search */}
        <form
          action="/explore"
          method="get"
          className="hidden md:flex flex-1 max-w-md mx-auto"
        >
          <input
            type="text"
            name="q"
            placeholder="Search Chatter..."
            className="w-full bg-white/10 text-white placeholder-white/40 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <nav className="hidden md:flex items-center gap-4 ml-auto">
          <Link
            href="/"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Feed
          </Link>
          <Link
            href="/explore"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Explore
          </Link>
          <Link
            href="/bookmarks"
            className="text-sm text-white/70 hover:text-white transition"
          >
            Bookmarks
          </Link>
        </nav>

        <div className="flex items-center gap-3 ml-auto md:ml-0">
          {user ? (
            <>
              <Link
                href="/write"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition"
              >
                <NotebookPen strokeWidth={1.5} /> Write
              </Link>
              <button className="text-white/70 hover:text-white transition">
                <Bell strokeWidth={1.5} />
              </button>
              <Link href={`/${profile?.username}`}>
                <img
                  src={
                    profile?.avatar_url ||
                    `https://i.pravatar.cc/32?u=${user.id}`
                  }
                  alt={profile?.full_name || "Profile"}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
                />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-white/70 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition"
              >
                Get started
              </Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <Link
                href="/write"
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-full transition"
              >
                <NotebookPen strokeWidth={1.5} /> Write
              </Link>
              <button className="text-white/70 hover:text-white transition">
                < Bell strokeWidth={1.5} />
              </button>
              <Link href={`/${profile?.username}`}>
                <img
                  src={
                    profile?.avatar_url ||
                    `https://i.pravatar.cc/32?u=${user.id}`
                  }
                  alt={profile?.full_name || "Profile"}
                  className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
                />
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
