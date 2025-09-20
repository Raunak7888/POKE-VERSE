"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignInDialog } from "@/components/navbar/signInDialog";
import { User } from "../utils/types";
import { BackgroundLines } from "../ui/background-lines";

interface Props {
  user: User | null;
}

export function WelcomeSection({ user }: Props) {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-6 md:px-24 text-center">
      <BackgroundLines  className="flex items-center justify-center w-full flex-col px-4">
        {/* Title */}
        <h1 className="text-4xl text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-bold font-krona mb-4 leading-tight">
          WELCOME TO <span className="text-primary">POKEVERSE</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl md:text-2xl my-6 font-bold text-foreground font-krona max-w-2xl">
          Dive into Pokémon-inspired games, quizzes, and adventures
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {!user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="border-2 border-primary text-md bg-background text-primary hover:bg-primary hover:text-background w-full sm:w-auto"
                >
                  Get Started
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <SignInDialog />
              </DialogContent>
            </Dialog>
          )}
          <a href="#games" className="w-full sm:w-auto">
            <Button
              variant="default"
              className="border-2 border-foreground text-md bg-background text-foreground hover:bg-foreground hover:text-background w-full sm:w-auto"
            >
              Explore Games
            </Button>
          </a>
        </div>
      </BackgroundLines>
    </section>
  );
}
