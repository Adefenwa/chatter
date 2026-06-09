import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileTabs from "@/components/shared/ProfileTabs";
import FollowButton from "@/components/shared/FollowButton";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  // Fetch published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select(
      "*, post:posts(*, author:profiles(username, full_name, avatar_url))",
    )
    .eq("user_id", profile.id);

  // Fetch follower and following counts
  const { count: followerCount } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("following_id", profile.id);

  const { count: followingCount } = await supabase
    .from("follows")
    .select("*", { count: "exact" })
    .eq("follower_id", profile.id);

  // Check if current user is following this profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: followData } = user
    ? await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", profile.id)
        .single()
    : { data: null };

  const isFollowing = !!followData;

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      {/* <header className="sticky top-0 z-50 bg-[#0f172a] border-b border-white/10 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-white">
            Chatter
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Feed
            </Link>
            <Link
              href="/authors"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Writers
            </Link>
            <Link
              href="/topics"
              className="text-sm text-white/60 hover:text-white transition"
            >
              Topics
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <button className="text-white/50 hover:text-white transition">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden">
              <img
                src={
                  profile.avatar_url || `https://i.pravatar.cc/32?u=${username}`
                }
                alt="avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-10">
          {/* Avatar */}
          <div className="shrink-0">
            <img
              src={
                profile.avatar_url || `https://i.pravatar.cc/100?u=${username}`
              }
              alt={profile.full_name}
              className="w-24 h-24 rounded-full border-4 border-white/10 object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-white">
                  {profile.full_name}
                </h1>
                <p className="text-sm text-white/50 mt-1 max-w-md">
                  {profile.bio || "Writer on Chatter."}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <FollowButton
                  profileId={profile.id}
                  currentUserId={user?.id || null}
                  initialFollowing={isFollowing}
                />
                <button className="border border-white/20 text-white/70 hover:bg-white/10 text-sm font-medium px-5 py-2 rounded-lg transition">
                  Message
                </button>
              </div>
            </div>

            {/* Stats + Social */}
            <div className="flex items-center gap-6 mt-4">
              <div className="text-sm text-white/60">
                <span className="text-white font-semibold">
                  {followerCount && followerCount >= 1000
                    ? `${(followerCount / 1000).toFixed(1)}k`
                    : followerCount || 0}
                </span>{" "}
                Followers
              </div>
              <div className="text-sm text-white/60">
                <span className="text-white font-semibold">
                  {followingCount || 0}
                </span>{" "}
                Following
              </div>
              {/* <div className="flex items-center gap-3 ml-2">
                <button className="text-white/30 hover:text-white transition text-lg">
                  ↗️
                </button>
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/30 hover:text-white transition text-lg"
                  >
                    🌐
                  </a>
                )}
                <button className="text-white/30 hover:text-white transition text-lg">
                  @
                </button>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <ProfileTabs
          posts={posts || []}
          bookmarks={bookmarks || []}
          profileId={profile.id}
        />
      </div>

      {/* Mobile Bottom Nav */}
      {/* <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#0f172a] border-t border-white/10 flex items-center justify-around py-3">
        {[
          { label: "Home", icon: "🏠", href: "/" },
          { label: "Search", icon: "🔍", href: "/explore" },
          { label: "Write", icon: "➕", href: "/write" },
          { label: "Profile", icon: "👤", href: `/${username}` },
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
