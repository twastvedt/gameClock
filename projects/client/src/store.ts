import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { useRouter } from "vue-router";
import { Game, Local } from "../../common/src/Game";
import { ClientEvents, ServerEvents } from "../../common/src/socketTypes";

const router = useRouter();

let socketClient: Socket<ServerEvents, ClientEvents>;

export const useStore = defineStore("main", {
  state: () => {
    return {
      game: Game.makeDefault(),
      drawer: false,
      editMode: false,
      activeTime: 0,
      local: true,
    };
  },
  actions: {
    connect() {
      if (socketClient?.connected) {
        return socketClient;
      }

      if (typeof import.meta.env.VITE_SV_ADDRESS === "string") {
        socketClient = io(import.meta.env.VITE_SV_ADDRESS);
      } else {
        socketClient = io();
      }

      socketClient.on("initialize", () => {
        console.log("Socket connected");
      });

      socketClient.on("update", (changes) => {
        const game = this.game;

        Object.entries(changes).forEach(([key, value]) => {
          switch (key) {
            case "players":
              game[key] = Object.assign(game[key], value);
              break;

            default:
              (game as any)[key] = value;
              break;
          }
        });
      });

      return socketClient;
    },
    disconnect() {
      if (socketClient?.connected) {
        socketClient.disconnect();
      }
    },
    setLocal() {
      if (!this.local) {
        this.local = true;
        this.disconnect();
        this.game.name = Local;
      }
    },
    setRoom(room?: string) {
      const client = this.connect();
      this.local = false;

      if (room) {
        client.emit("setRoom", room, (game) => {
          this.game = game;
        });
      } else {
        client.emit("newRoom", (name) => {
          router.push(`/room/${name}`);
        });
      }
    },
    nextTurn() {
      const update = this.game.nextTurn();

      this.sendUpdate(update);
    },
    pause() {
      const update = this.game.pause();

      this.sendUpdate(update);
    },
    sendUpdate(changes: Partial<Game> | undefined) {
      if (changes && !this.local && socketClient.connected) {
        socketClient.emit("update", changes);
      }
    },
  },
});
