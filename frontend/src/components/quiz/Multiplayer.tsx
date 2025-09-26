"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Multiplayer() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={() => router.push("/quiz/multiplayer/create")}
        className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary/50 text-foregound"
      >
        <Users className="h-5 w-5" />
        <span>Create Multiplayer Room</span>
      </Button>
    </div>
  );
}
