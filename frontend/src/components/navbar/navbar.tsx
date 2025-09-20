// components/Navbar.tsx
"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { SignInDialog } from "./signInDialog";
import { useAuthStore } from "@/hooks/useAuthStore";
import api from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./themeToggle";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const loadFromCookies = useAuthStore((s) => s.loadFromCookies);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    loadFromCookies();

    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/success", {
          withCredentials: true,
        });
        if (res.data) {
          const { user, accessToken, refreshToken } = res.data;
          setAuth(user, accessToken, refreshToken);
        }
      } catch {
        console.log("Not logged in yet");
      }
    };

    checkAuth();
  }, [loadFromCookies, setAuth]);

  // Close menu automatically after login
  useEffect(() => {
    if (user && menuOpen) {
      setMenuOpen(false);
    }
  }, [user, menuOpen]);

  return (
    <nav
      className="w-full flex items-center justify-between px-6 py-3 shadow-md fixed top-0 left-0 z-50"
      style={{ backgroundColor: "#EE4035" }}
    >
      {/* Title */}
      <h1
        className="text-3xl font-bold text-white font-krona tracking-wide cursor-pointer"
        onClick={() => router.push("/")}
      >
        Pokeverse
      </h1>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center font-aclonica gap-6 text-white font-medium">
        <Link href="/">Home</Link>
        <Link href="/quiz">PokeQuiz</Link>
        <Link href="/about">About</Link>
        <ThemeToggle />

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
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold">
                  Profile
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-20 h-20 ring-4 ring-[#EE4035]">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-[#EE4035] text-white">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-200">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearAuth}
                >
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-md bg-primary hover:bg-white hover:text-primary text-white border-2 border-white">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Mobile Menu (Dropdown) */}
      <div className="md:hidden gap-3 flex">
        {user ? (
          <Dialog>
            <DialogTrigger asChild>
              <Avatar className="cursor-pointer ring-2 ring-white">
                <AvatarImage
                  src={user.image || "https://via.placeholder.com/150"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-white text-[#EE4035] font-bold">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-semibold">
                  Profile
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-20 h-20 ring-4 ring-[#EE4035]">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="bg-[#EE4035] text-white">
                    {user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xl font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-200">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearAuth}
                >
                  Sign Out
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-md bg-primary hover:bg-white hover:text-primary text-white border-2 border-white">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <SignInDialog />
            </DialogContent>
          </Dialog>
        )}
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 focus:outline-none"
            >
              ☰
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#EE4035] text-white font-aclonica w-40"
          >
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/quiz">PokeQuiz</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ThemeToggle/>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
