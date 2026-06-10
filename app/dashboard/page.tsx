import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AnalyticsChart from "@/components/shared/AnalyticsChart";
import { Bell, CircleQuestionMark, Plus } from "lucide-react";
import LogoutButton from "@/components/shared/LogoutButton";
import Image from "next/image";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all posts by this author
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch total likes across all posts
  const postIds = posts?.map((p) => p.id) || [];

  const { count: totalLikes } = await supabase
    .from("likes")
    .select("*", { count: "exact" })
    .in("post_id", postIds);

  const { count: totalComments } = await supabase
    .from("comments")
    .select("*", { count: "exact" })
    .in("post_id", postIds);

  const { count: totalBookmarks } = await supabase
    .from("bookmarks")
    .select("*", { count: "exact" })
    .in("post_id", postIds);

  // Fetch per-post stats
  const postsWithStats = await Promise.all(
    (posts || []).slice(0, 5).map(async (post) => {
      const { count: likes } = await supabase
        .from("likes")
        .select("*", { count: "exact" })
        .eq("post_id", post.id);

      const { count: comments } = await supabase
        .from("comments")
        .select("*", { count: "exact" })
        .eq("post_id", post.id);

      const { count: bookmarks } = await supabase
        .from("bookmarks")
        .select("*", { count: "exact" })
        .eq("post_id", post.id);

      return {
        ...post,
        likes: likes || 0,
        comments: comments || 0,
        bookmarks: bookmarks || 0,
        views:
          (likes || 0) * 45 +
          (comments || 0) * 18 +
          (bookmarks || 0) * 12 +
          1200,
      };
    }),
  );

  // Generate chart data for last 7 days vs previous 7 days
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const chartData = days.map((day, index) => ({
    day,
    current: (totalLikes || 0) * 6 + index * 18 + 110,
    previous: (totalComments || 0) * 4 + index * 12 + 70,
  }));

  const totalViews = (postsWithStats || []).reduce(
    (sum, post) => sum + post.views,
    0,
  );

  const metrics = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      change: "+12%",
      positive: true,
    },
    {
      label: "Total Likes",
      value: totalLikes?.toLocaleString() || "0",
      change: "+5%",
      positive: true,
    },
    {
      label: "Comments",
      value: totalComments?.toLocaleString() || "0",
      change: "-2%",
      positive: false,
    },
    {
      label: "Bookmarks",
      value: totalBookmarks?.toLocaleString() || "0",
      change: "+8%",
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-[#0f172a] border-r border-white/10 p-4 min-h-screen sticky top-0">
        <div className="mb-6">
          <p className="text-lg font-bold text-white">Chatter</p>
          <p className="text-xs text-white/30">CREATOR STUDIO</p>
        </div>

        <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg mb-6 transition">
          <Plus strokeWidth={1.5} /> New Post
        </button>

        <div className="mt-auto flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 transition">
            <CircleQuestionMark strokeWidth={1.5} /> Help
          </button>
          <LogoutButton className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white hover:bg-white/5 transition" />
          <div className="flex items-center gap-3 px-3 py-3 mt-2 border-t border-white/10">
            <Image
              src={
                profile?.avatar_url || `https://i.pravatar.cc/32?u=${user.id}`
              }
              alt={profile?.full_name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-xs font-semibold text-white">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs text-white/30">Pro Creator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-white">Analytics Overview</h1>
            <p className="text-xs text-white/30 mt-0.5">Last 7 days overview</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search analytics..."
              className="hidden md:block bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="text-white/50 hover:text-white transition">
              <Bell strokeWidth={1.5} />
            </button>
            <Image
              src={
                profile?.avatar_url || `https://i.pravatar.cc/32?u=${user.id}`
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <p className="text-xs text-white/40 mb-1">{metric.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <span
                  className={`text-xs font-medium ${metric.positive ? "text-green-400" : "text-red-400"}`}
                >
                  {metric.change}
                </span>
              </div>
              {/* Mini sparkline bar */}
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${metric.positive ? "bg-blue-500" : "bg-red-400"}`}
                  style={{ width: metric.positive ? "70%" : "40%" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Engagement Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">
                Engagement Overview
              </h2>
              <p className="text-xs text-white/30 mt-0.5">
                Daily interactions over time
              </p>
            </div>
          </div>
          <AnalyticsChart data={chartData} />
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white">
              Top Performing Posts
            </h2>
            <Link
              href="/write"
              className="text-xs text-blue-400 hover:text-blue-300 transition"
            >
              View All Posts
            </Link>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-3 border-b border-white/10 mb-4">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider col-span-2">
              Post Title
            </p>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-right">
              Views
            </p>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-right">
              Likes
            </p>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider text-right">
              Comments
            </p>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-4">
            {postsWithStats.length === 0 && (
              <p className="text-white/20 text-sm text-center py-8">
                No posts yet.
              </p>
            )}
            {postsWithStats.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-5 gap-4 items-center"
              >
                <div className="col-span-2 flex items-center gap-3">
                  {post.cover_image && (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                  )}
                  <p className="text-sm text-white/80 line-clamp-1">
                    {post.title}
                  </p>
                </div>
                <p className="text-sm text-white/60 text-right">
                  {post.views.toLocaleString()}
                </p>
                <p className="text-sm text-white/60 text-right">{post.likes}</p>
                <p className="text-sm text-white/60 text-right">
                  {post.comments}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {/* <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0f172a] border-t border-white/10 flex items-center justify-around py-3">
        {[
          { label: "Home", icon: "🏠", href: "/" },
          { label: "Search", icon: "🔍", href: "/explore" },
          { label: "Write", icon: "➕", href: "/write" },
          { label: "Profile", icon: "👤", href: `/${profile?.username}` },
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
      </nav> */}
    </div>
  );
}
