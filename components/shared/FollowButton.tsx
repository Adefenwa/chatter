"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  profileId: string;
  currentUserId: string | null;
  initialFollowing: boolean;
};

export default function FollowButton({
  profileId,
  currentUserId,
  initialFollowing,
}: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleFollow = async () => {
    if (!currentUserId) {
      router.push("/login");
      return;
    }

    setLoading(true);

    if (following) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", profileId);
    } else {
      await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: profileId,
      });
    }

    setFollowing(!following);
    setLoading(false);
    router.refresh();
  };

  if (currentUserId === profileId) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`text-sm font-medium px-5 py-2 rounded-lg transition disabled:opacity-50 ${
        following
          ? "border border-white/20 text-white/70 hover:bg-white/10"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  );
}
