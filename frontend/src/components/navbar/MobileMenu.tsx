import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./themeToggle";
import AuthMenu from "./AuthMenu";
import { User } from "../utils/types";

export default function MobileMenu({ user, menuOpen, setMenuOpen }: { user: User | null; menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <div className="md:hidden gap-3 flex">
      <AuthMenu user={user} isMobile />
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            ☰
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-primary text-white font-aclonica w-40">
          <DropdownMenuItem asChild><Link href="/">Home</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/quiz">PokeQuiz</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/about">About</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><ThemeToggle /></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
