import { Server, ServerOptions } from "socket.io";
import { Server as NodeServer } from "http";
import {
  ClientToServerEvents,
  IntraServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../common/src/socketTypes";
import { getRoom } from "./RoomManager";

class State {
  public io?: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    IntraServerEvents,
    SocketData
  >;

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

      const room = getRoom();

      socket.emit("initialize", room);
    });
  }
}

export const state = new State();
