import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { Game } from "../../common/src/Game";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../common/src/socketTypes";

let socketClient: Socket<ServerToClientEvents, ClientToServerEvents>;

export const useStore = defineStore("main", {
  state: () => {
    return {
      game: undefined as Game | undefined,
    };
  },
  actions: {
    connect() {
      if (typeof import.meta.env.VITE_SV_ADDRESS === "string") {
        socketClient = io(import.meta.env.VITE_SV_ADDRESS);
      } else {
        socketClient = io();
      }

      socketClient.on("initialize", (game) => {
        console.log("Socket connected");

        this.game = game;
      });

      socketClient.on("update", (changes) => {
        const game = this.game;

        if (!game) {
          throw new Error("No game!");
        }

        Object.entries(changes).forEach(([key, value]) => {
          if (key in game) {
            (game as any)[key] = value;
          }
        });
      });
    },
    disconnect() {
      if (socketClient?.connected) {
        socketClient.disconnect();
      }
    },
  },
});
