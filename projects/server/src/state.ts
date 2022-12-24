import { Server, ServerOptions } from "socket.io";
import { Server as NodeServer } from "http";
import {
  ClientEvents,
  ServerSideEvents,
  ServerEvents,
  SocketData,
} from "../../common/src/socketTypes";
import { getName, getRoom } from "./RoomManager";
import { Game } from "../../common/src/Game";

class State {
  public io?: Server<ClientEvents, ServerEvents, ServerSideEvents, SocketData>;

  public setUpSockets(server: NodeServer): void {
    const options: Partial<ServerOptions> = {
      serveClient: false,
    };

    if (process.env.VITE_SV_ADDRESS) {
      options.cors = {
        origin: process.env.VITE_SV_ADDRESS,
        methods: ["GET", "POST"],
      };
    }

    this.io = new Server(server, options);

    this.io.on("connection", (socket) => {
      console.log("a user connected");

      let game: Game;

      socket.on("setRoom", (room, response) => {
        for (const room of socket.rooms) {
          socket.leave(room);
        }

        game = getRoom(room);

        socket.join(game.name);

        response(game);
      });

      socket.on("newRoom", (response) => {
        const room = getName();

        response(room);
      });

      socket.on("nextTurn", (time) => {
        if (game) {
          game.nextTurn();
        }
      });
    });
  }
}

export const state = new State();
