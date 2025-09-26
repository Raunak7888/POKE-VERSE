"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";

export default function SinglePlayer() {
  const regions = ["All", "Kanto", "Johto", "Hoenn", "Sinnoh"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const [region, setRegion] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [rounds, setRounds] = useState(5);
  const router = useRouter();

  const handleStart = () => {
    const regionValue = region === "all" ? "" : region;
    const difficultyValue = difficulty === "all" ? "" : difficulty;

    router.push(
      `/quiz/singleplayer?region=${regionValue}&difficulty=${difficultyValue}&rounds=${rounds}`
    );
  };


  // Helper: cycle through arrays
  const cycleValue = (arr: string[], current: string, dir: "prev" | "next") => {
    if (!current) return arr[0].toLowerCase();
    const index = arr.findIndex(
      (v) => v.toLowerCase() === current.toLowerCase()
    );
    if (index === -1) return arr[0].toLowerCase();
    if (dir === "next") return arr[(index + 1) % arr.length].toLowerCase();
    if (dir === "prev")
      return arr[(index - 1 + arr.length) % arr.length].toLowerCase();
    return current;
  };

  return (
    <div className="space-y-6">
      {/* Region */}
      <div className="space-y-2">
        <Label className="text-primary">Region</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRegion(cycleValue(regions, region, "prev"))}
            className="bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="bg-muted rounded-xl px-4 w-full justify-between">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((r) => (
                <SelectItem key={r} value={r.toLowerCase()}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRegion(cycleValue(regions, region, "next"))}
            className="bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {/* Quick All Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRegion("all")}
            className="rounded-xl"
          >
            All
          </Button>
        </div>
      </div>

      {/* Difficulty */}
      <div className="space-y-2">
        <Label className="text-primary">Difficulty</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setDifficulty(cycleValue(difficulties, difficulty, "prev"))
            }
            className="bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="bg-muted rounded-xl px-4 w-full justify-between">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((d) => (
                <SelectItem key={d} value={d.toLowerCase()}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setDifficulty(cycleValue(difficulties, difficulty, "next"))
            }
            className="bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          {/* Quick All Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDifficulty("all")}
            className="rounded-xl"
          >
            All
          </Button>
        </div>
      </div>

      {/* Rounds with stepper */}
      <div className="space-y-2">
        <Label className="text-primary">Rounds</Label>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRounds((r) => Math.max(5, r - 5))}
            disabled={rounds <= 5}
            className="bg-muted"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-full text-center font-medium">{rounds}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRounds((r) => Math.min(20, r + 5))}
            disabled={rounds >= 20}
            className="bg-muted"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRounds(20)}
            className="rounded-xl"
          >
            All
          </Button>
        </div>
      </div>

      <Button
        onClick={handleStart}
        className="w-full bg-primary hover:bg-primary/50 text-foreground rounded-xl"
      >
        Start Quiz
      </Button>
    </div>
  );
}
