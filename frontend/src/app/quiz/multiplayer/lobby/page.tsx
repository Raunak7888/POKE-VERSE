"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check, Crown, Users, Target, Clock } from "lucide-react";
import { toast } from "sonner";
import Chat from "@/components/quiz/multiPlayerQuestion/Chat";
import { useMultiplayerRoomStore } from "@/store/useMultiplayerRoomStore";
import { MultiplayerPlayersInRoomDto } from "@/components/utils/types";
import { IMessage } from "@stomp/stompjs";
import { connectWebSocket, disconnectWebSocket } from "@/components/utils/webSocketClient";

export default function Lobby() {
  const [copied, setCopied] = useState(false);
  const room = useMultiplayerRoomStore().room;
  const [roomCode] = useState(String(room?.code || "000000"));
  const [players, setPlayers] = useState<MultiplayerPlayersInRoomDto[]>(
    room?.players ?? []
  );
  const [maxPlayers] = useState(room?.maxPlayers || 2);
  const [rounds] = useState(room?.rounds || 5);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!room) return;

    const token = localStorage.getItem("token");
    const roomTopic = `/topic/room/${room.id}`;

    const handleRoomUpdate = (message: IMessage) => {
      try {
        const updatedRoom = JSON.parse(message.body);
        setPlayers(updatedRoom.players || []);
        console.log("♻️ Room updated:", updatedRoom);
      } catch (err) {
        console.error("Failed to parse room update:", err);
      }
    };

    // Connect and subscribe
    const client = connectWebSocket({
      token: token || undefined,
      subscriptions: [{ topic: roomTopic, callback: handleRoomUpdate }],
      onConnected: () => console.log("Connected to room topic", roomTopic),
    });
    return () => {
      disconnectWebSocket();
    };
  }, [room, room?.id]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      toast.success("Game Started!");
    }
  }, [countdown]);

  const isHost = players.find((p) => p.id === 1)?.isHost;

  return (
    <>
      <div
        className="w-screen bg-background md:scale-75 md:mt-0 flex justify-center items-center p-4 mt-15"
        style={{ height: "92vh" }}
      >
        <div className="w-full h-full max-w-7xl">
          {/* Mobile/Tablet Layout (< lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:hidden bg-card rounded-3xl border-2 border-border w-full h-full p-6 space-y-4 shadow-lg overflow-y-auto"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-2"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Game Lobby
              </h1>
              <p className="text-sm text-foreground/60">
                Waiting for players to join...
              </p>
            </motion.div>

            {/* Room Code */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-background rounded-2xl border-2 border-foreground/20 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">
                  Room Code
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRoomCode}
                  className="hover:bg-primary/10 transition h-8"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                {roomCode.split("").map((digit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="w-10 h-12 flex items-center justify-center bg-foreground/5 border-2 border-foreground/20 rounded-lg text-xl font-bold text-foreground"
                  >
                    {digit}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-center text-foreground/50">
                Share this code with your friends
              </p>
            </motion.div>

            {/* Game Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="bg-background rounded-xl border-2 border-foreground/20 p-3 space-y-2">
                <div className="flex items-center gap-2 text-foreground/60">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Rounds</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{rounds}</p>
              </div>
              <div className="bg-background rounded-xl border-2 border-foreground/20 p-3 space-y-2">
                <div className="flex items-center gap-2 text-foreground/60">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">Players</span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {players.length}/{maxPlayers}
                </p>
              </div>
            </motion.div>

            {/* Players List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Players in Lobby
              </h3>
              <div className="space-y-2">
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-background rounded-xl border-2 border-foreground/20 p-3 flex items-center justify-between hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                        {player.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                          {player.username}
                          {player.isHost && (
                            <Crown className="h-3 w-3 text-yellow-500" />
                          )}
                        </p>
                        <p className="text-xs text-foreground/50">
                          {player.isHost ? "Host" : "Player"}
                        </p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </motion.div>
                ))}
                {Array.from({ length: maxPlayers - players.length }).map(
                  (_, index) => (
                    <motion.div
                      key={`empty-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.6 + (players.length + index) * 0.1,
                      }}
                      className="bg-background/50 rounded-xl border-2 border-dashed border-foreground/20 p-3 flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center">
                        <Users className="h-4 w-4 text-foreground/30" />
                      </div>
                      <p className="text-foreground/40 text-sm">
                        Waiting for player...
                      </p>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {countdown !== null ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-primary/10 rounded-2xl p-6 text-center"
                >
                  <Clock className="h-10 w-10 text-primary mx-auto mb-3 animate-pulse" />
                  <p className="text-foreground/60 mb-2 text-sm">
                    Game starting in
                  </p>
                  <motion.p
                    key={countdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold text-primary"
                  >
                    {countdown}
                  </motion.p>
                </motion.div>
              ) : isHost ? (
                <Button
                  onClick={handleStart}
                  disabled={players.length < 2}
                  className="w-full h-11 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {players.length < 2
                    ? "Waiting for more players..."
                    : "Start Game"}
                </Button>
              ) : (
                <div className="bg-foreground/5 rounded-xl p-4 text-center">
                  <p className="text-foreground/60 text-sm">
                    Waiting for host to start the game...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Desktop Layout (>= lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:grid lg:grid-cols-2 gap-6 h-full"
          >
            {/* Left Side - Room Details */}
            <div className="bg-card rounded-3xl border-2 border-border p-8 shadow-lg flex flex-col">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center space-y-3 mb-8"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-3">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl font-extrabold text-foreground">
                  Game Lobby
                </h1>
                <p className="text-foreground/60">
                  Waiting for players to join...
                </p>
              </motion.div>

              {/* Room Code */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-background rounded-2xl border-2 border-foreground/20 p-6 space-y-4 mb-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground/60">
                    Room Code
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyRoomCode}
                    className="hover:bg-primary/10 transition h-8"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-foreground" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-3">
                  {roomCode.split("").map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="w-16 h-20 flex items-center justify-center bg-foreground/5 border-2 border-foreground/20 rounded-lg text-3xl font-bold text-foreground"
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-center text-foreground/50">
                  Share this code with your friends
                </p>
              </motion.div>

              {/* Game Settings */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                <div className="bg-background rounded-xl border-2 border-foreground/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Rounds</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground">{rounds}</p>
                </div>
                <div className="bg-background rounded-xl border-2 border-foreground/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">Players</span>
                  </div>
                  <p className="text-4xl font-bold text-foreground">
                    {players.length}/{maxPlayers}
                  </p>
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-auto"
              >
                {countdown !== null ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/60"
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-primary/30 h-100 w-150 flex items-center justify-center flex-col rounded-2xl p-12 text-center shadow-2xl"
                    >
                      <Clock className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
                      <p className="text-foreground/60 mb-4 text-lg">
                        Game starting in
                      </p>
                      <motion.p
                        key={countdown}
                        initial={{ scale: 1.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl font-bold text-primary"
                      >
                        {countdown}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ) : isHost ? (
                  <Button
                    onClick={handleStart}
                    disabled={players.length < 2}
                    className="w-full h-14 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {players.length < 2
                      ? "Waiting for more players..."
                      : "Start Game"}
                  </Button>
                ) : (
                  <div className="bg-foreground/5 rounded-xl p-5 text-center">
                    <p className="text-foreground/60">
                      Waiting for host to start the game...
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Side - Players List */}
            <div className="bg-card rounded-3xl border-2 border-border p-8 shadow-lg flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col h-full"
              >
                <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-primary" />
                  Players in Lobby
                </h3>
                <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-background rounded-xl border-2 border-foreground/20 p-5 flex items-center justify-between hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                          {player.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-lg flex items-center gap-2">
                            {player.username}
                            {player.isHost && (
                              <Crown className="h-5 w-5 text-yellow-500" />
                            )}
                          </p>
                          <p className="text-sm text-foreground/50">
                            {player.isHost ? "Host" : "Player"}
                          </p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </motion.div>
                  ))}
                  {Array.from({ length: maxPlayers - players.length }).map(
                    (_, index) => (
                      <motion.div
                        key={`empty-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.6 + (players.length + index) * 0.1,
                        }}
                        className="bg-background/50 rounded-xl border-2 border-dashed border-foreground/20 p-5 flex items-center gap-4"
                      >
                        <div className="w-14 h-14 rounded-full bg-foreground/5 flex items-center justify-center">
                          <Users className="h-6 w-6 text-foreground/30" />
                        </div>
                        <p className="text-foreground/40">
                          Waiting for player...
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <Chat />
    </>
  );
}
