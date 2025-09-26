"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Dice2 } from "lucide-react";

export default function Create() {
  const [roomName, setRoomName] = useState("");
  const [rounds, setRounds] = useState(5);
  const [players, setPlayers] = useState(2);

  const handleCreate = () => {
    console.log({ roomName, rounds, players });
  };

  const generateRandomRoomName = () => {
    const adjectives = ["Swift", "Brave", "Clever", "Wild"];
    const nouns = ["Pikachu", "Charmander", "Squirtle", "Bulbasaur"];
    const randomName = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`;
    setRoomName(randomName);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-card rounded-3xl border-3 border-border w-full max-w-md p-8 space-y-8"
      >
        {/* Header */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-center text-primary tracking-tight"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Create Multiplayer Room
        </motion.h2>

        {/* Room Name */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="roomName" className="text-foreground text-lg">
            Room Name
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              id="roomName"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="bg-muted rounded-xl flex-1 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 transition"
            />
            <Button
              size="icon"
              variant="outline"
              onClick={generateRandomRoomName}
              className="hover:bg-primary/10 transition text-foreground"
            >
              <Dice2 className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Rounds */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label className="text-foreground text-lg">Rounds</Label>
          <div className="flex items-center justify-around gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRounds((r) => Math.max(5, r - 5))}
              disabled={rounds <= 5}
              className={`bg-muted transition rounded-full text-foreground ${
                rounds <= 5 ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/10"
              }`}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <span className="w-16 text-center font-semibold text-lg text-foreground">
              {rounds}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRounds((r) => Math.min(20, r + 5))}
              disabled={rounds >= 20}
              className={`bg-muted transition rounded-full text-foreground ${
                rounds >= 20 ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/10"
              }`}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Players */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Label className="text-foreground text-lg">Max Players</Label>
          <div className="flex items-center justify-around gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPlayers((p) => Math.max(2, p - 1))}
              disabled={players <= 2}
              className={`bg-muted transition rounded-full text-foreground ${
                players <= 2 ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/10"
              }`}
            >
              <Minus className="h-5 w-5" />
            </Button>
            <span className="w-16 text-center font-semibold text-lg text-foreground">
              {players}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPlayers((p) => Math.min(6, p + 1))}
              disabled={players >= 6}
              className={`bg-muted transition rounded-full text-foreground ${
                players >= 6 ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/10"
              }`}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleCreate}
            disabled={!roomName}
            className={`w-full text-lg font-semibold rounded-xl transition-colors ${
              roomName
                ? "bg-primary text-foreground hover:bg-primary/80"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Create Room
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
