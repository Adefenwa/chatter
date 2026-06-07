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

export default async function MobileNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username = "";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = data?.username || "";
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0f172a] border-t border-white/10 flex items-center justify-around py-3 z-50">
      {[
        { label: "Home", icon: <House strokeWidth={1.5} />, href: "/" },
        { label: "Explore", icon: <ListFilter />, href: "/explore" },
        { label: "Write", icon: <NotebookPen />, href: "/write" },
        { label: "Saved", icon: <Book />, href: "/bookmarks" },
        {
          label: "Profile",
          icon: <User strokeWidth={1.5} />,
          href: user ? `/${username}` : "/login",
        },
      ].map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex flex-col items-center gap-0.5 text-white/40 hover:text-white transition"
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
