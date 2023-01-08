import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";
import { Game, Local } from "../../common/src/Game";
import { Player } from "../../common/src/Player";
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

      if (typeof import.meta.env.VITE_SERVER_URL === "string") {
        let uri = import.meta.env.VITE_SERVER_URL;

        if (typeof import.meta.env.VITE_SERVER_PORT === "string") {
          uri += `:${import.meta.env.VITE_SERVER_PORT}`;
        }

        socketClient = io(uri);
      } else {
        socketClient = io();
      }

      socketClient.on("initialize", () => {
        console.log("Socket connected");
      });

      socketClient.on("update", (changes) => {
        this.game.applyChanges(changes);
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

      if (room) {
        client.emit("setRoom", room, (game) => {
          this.game = Game.clone(game);
          this.local = false;
        });
      } else {
        client.emit("newRoom", (game) => {
          this.$router.push({ name: "room", params: { room: game.name } });
        });
      }
    },
    nextTurn() {
      this.sendUpdate(this.game.nextTurn());
    },
    setPause(paused?: boolean) {
      const changes = this.game.setPause(paused);

      if (changes?.paused === false) {
        this.editMode = false;
      }

      this.sendUpdate(changes);
    },
    addPlayer(name?: string) {
      this.sendUpdate(this.game.addPlayer(name));
    },
    updatePlayer(player: Player) {
      this.sendUpdate({ players: { [player.id]: player } });
    },
    changeOrder(newOrder: string[]) {
      this.game.order = newOrder;
      this.sendUpdate({ order: newOrder });
    },
    sendUpdate(changes: Partial<Game> | undefined) {
      if (changes && !this.local && socketClient.connected) {
        socketClient.emit("update", changes);
      }
    },
  },
});
