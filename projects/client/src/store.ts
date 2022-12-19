import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { Game } from "../../common/src/Game";
import { ClientEvents, ServerEvents } from "../../common/src/socketTypes";

let socketClient: Socket<ServerEvents, ClientEvents>;

export const useStore = defineStore("main", {
  state: () => {
    return {
      game: Game.makeDefault(),
      drawer: false,
      editMode: false,
      activeTime: 0,
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
