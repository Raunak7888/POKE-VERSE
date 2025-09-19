"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "../utils/types";
import { useRouter } from "next/navigation";
import { SignInDialog } from "./signInDialog";
import { useAuthStore } from "@/hooks/useAuthStore";

export default function Navbar() {
  const router = useRouter();
  const { user, setAuth, loadFromCookies, clearAuth } = useAuthStore();

  // Extract query params after OAuth redirect
  useEffect(() => {
    loadFromCookies();

    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");
    const accessToken = params.get("token");
    const refreshToken = params.get("refreshToken");

    if (userParam && accessToken && refreshToken) {
      try {
        // backend sends user like: AuthenticatedUser[user=UserDto[id=1, username=..., email=..., profilePictureUrl=...]]
        const cleaned = decodeURIComponent(userParam);

        // extract UserDto part from string
        const match = cleaned.match(/UserDto\[([^\]]+)\]/);
        let parsedUser: User | null = null;

        if (match) {
          const parts = match[1].split(",").map((p) => p.trim());

          const userRecord: Record<string, string> = {};
          parts.forEach((p) => {
            const [key, val] = p.split("=");
            if (key && val) {
              userRecord[key] = val;
            }
          });

          parsedUser = {
            id: Number(userRecord["id"]),
            name: userRecord["username"],
            email: userRecord["email"],
            image: userRecord["profilePictureUrl"],
          };
        }

        if (parsedUser) {
          setAuth(parsedUser, accessToken, refreshToken);

          // clean up URL (remove query params)
          window.history.replaceState({}, document.title, "/");
        }
      } catch (err) {
        console.error("Failed to parse user from query params", err);
      }
    }
  }, [loadFromCookies, setAuth]);

  return (
    <nav
      className="w-full flex items-center justify-between px-6 py-3 shadow-md absolute"
      style={{ backgroundColor: "#EE4035" }}
    >
      {/* Title */}
      <h1
        className="text-3xl font-bold text-white font-krona tracking-wide cursor-pointer"
        onClick={() => router.push("/")}
      >
        Pokeverse
      </h1>

      {/* Links */}
      <div className="flex items-center font-aclonica gap-6 text-white font-medium">
        <Link href="/">Home</Link>
        <Link href="/quiz">PokeQuiz</Link>
        <Link href="/about">About</Link>

        {/* Auth Section */}
        {user ? (
          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-white">
                <AvatarImage
                  src={user.image || "https://via.placeholder.com/150"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-white text-[#EE4035] font-bold">
                  {user.name ? user.name[0] : "?"}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>

            {/* Profile Modal */}
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-semibold">
                  Your Profile
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-20 h-20 ring-4 ring-[#EE4035]">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-[#EE4035] text-white">
                    {user.name ? user.name[0] : "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => clearAuth()}
                >
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-4 text-md hover:bg-foreground"
              >
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </nav>
  );
}
