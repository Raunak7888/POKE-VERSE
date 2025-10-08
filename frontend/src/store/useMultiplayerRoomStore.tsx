import { MultiplayerRoomCreationDto } from "@/components/utils/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MultiplayerRoomState {
  room: MultiplayerRoomCreationDto | null;
  setRoom: (room: MultiplayerRoomCreationDto) => void;
  updateRoom: (partial: Partial<MultiplayerRoomCreationDto>) => void;
  clearRoom: () => void;
}

// ✅ Zustand store with persistence
export const useMultiplayerRoomStore = create<MultiplayerRoomState>()(
  persist(
    (set) => ({
      room: null,

      setRoom: (room) => set({ room }),

      updateRoom: (partial) =>
        set((state) =>
          state.room ? { room: { ...state.room, ...partial } } : state
        ),

      clearRoom: () => set({ room: null }),
    }),
    {
      name: "multiplayer-room-storage", // localStorage key
    }
  )
);
