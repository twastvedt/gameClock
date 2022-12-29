import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { Game, Local } from "../../common/src/Game";
import { ClientEvents, ServerEvents } from "../../common/src/socketTypes";

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

      if (
        typeof import.meta.env.VITE_SERVER_URL === "string" &&
        typeof import.meta.env.VITE_SERVER_PORT === "string"
      ) {
        socketClient = io(
          `${import.meta.env.VITE_SERVER_URL}:${
            import.meta.env.VITE_SERVER_PORT
          }`
        );
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
          this.game = Game.clone(game);
        });
      } else {
        client.emit("newRoom", (name) => {
          this.$router.push({ name: "room", params: { room: name } });
        });
      }
    },
    nextTurn() {
      this.sendUpdate(this.game.nextTurn());
    },
    setPause(paused?: boolean) {
      this.sendUpdate(this.game.setPause(paused));
    },
    addPlayer(name?: string) {
      this.sendUpdate(this.game.addPlayer(name));
    },
    sendUpdate(changes: Partial<Game> | undefined) {
      if (changes && !this.local && socketClient.connected) {
        socketClient.emit("update", changes);
      }
    },
  },
});
