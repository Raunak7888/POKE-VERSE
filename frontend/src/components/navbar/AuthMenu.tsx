"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { SignInDialog } from "./signInDialog";
import { User } from "../utils/types";

export default function AuthMenu({ user, isMobile }: { user: User | null; isMobile: boolean }) {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Avatar className="cursor-pointer ring-2 ring-foreground">
            <AvatarImage src={user.image || "https://via.placeholder.com/150"} alt={user.name} />
            <AvatarFallback className="bg-foreground text-primary font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>
        <DialogContent className="max-w-sm border-2 border-foreground" aria-describedby="sign-up-menu">
          <DialogHeader>
            <DialogTitle className="text-center text-foreground text-xl font-semibold">Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <Avatar className="w-20 h-20 ring-4 ring-primary">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-primary text-foreground">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xl text-foreground font-semibold">{user.name}</p>
              <p className="text-sm text-foreground">{user.email}</p>
            </div>
            <Button variant="outline" className="w-full text-white" onClick={clearAuth}>
              Sign Out
            </Button>
          </div>
          <DialogClose />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`${
            isMobile
              ? "text-md bg-primary hover:bg-foreground hover:text-primary text-foreground border-2 border-foreground"
              : "bg-primary hover:bg-foreground hover:text-primary text-foreground border-2 border-foreground"
          }`}
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border-2 border-foreground" aria-describedby="profile-dialog">
        <SignInDialog />
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
