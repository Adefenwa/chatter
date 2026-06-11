"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={
        className ??
        "flex items-center justify-center gap-1 py-2.5 cursor-pointer bg-red-500 rounded-xl text-sm text-white font-bold hover:bg-white/5 hover:border-2 hover:border-red-500 transition w-full"
      }
    >
      <LogOut strokeWidth={1.5} /> Logout
    </button>
  );
}
