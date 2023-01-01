import { Server, ServerOptions } from "socket.io";
import { Server as NodeServer } from "http";
import {
  ClientEvents,
  ServerSideEvents,
  ServerEvents,
  SocketData,
} from "../../common/src/socketTypes";
import { getGame } from "./RoomManager";
import { Game } from "../../common/src/Game";

class State {
  public io?: Server<ClientEvents, ServerEvents, ServerSideEvents, SocketData>;

  public setUpSockets(server: NodeServer): void {
    const options: Partial<ServerOptions> = {
      serveClient: false,
    };

    if (process.env.VITE_SERVER_URL && process.env.BROWSER_PORT) {
      options.cors = {
        origin: `${process.env.VITE_SERVER_URL}:${process.env.BROWSER_PORT}`,
        methods: ["GET", "POST"],
      };
    }

    this.io = new Server(server, options);

    this.io.on("connection", (socket) => {
      console.debug(`${socket.id}: connected`);

      let game: Game;

      socket.on("setRoom", (room, response) => {
        const oldName = game?.name;

        if (oldName) {
          socket.leave(oldName);
        }

        game = getGame(room);

        socket.join(game.name);

        console.debug(
          `${socket.id}: ${oldName ? `left ${oldName}, ` : ""}joined ${
            game.name
          }`
        );

        response(game);
      });

      socket.on("newRoom", (response) => {
        game = getGame();

        response(game);
      });

      socket.on("update", (changes) => {
        if (game) {
          game.applyChanges(changes);
          socket.broadcast.to(game.name).emit("update", changes);
        }
      });
    });
  }
}

export const state = new State();
