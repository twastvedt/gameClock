import { Game } from "./Game";

export interface ServerEvents {
  update: (state: Partial<Game>) => void;
  initialize: () => void;
}

export interface ClientEvents {
  update: (state: Partial<Game>) => void;
  nextTurn: (time: number) => void;
  setRoom: (room: string, response: (game: Game) => void) => void;
  newRoom: (response: (room: string) => void) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ServerSideEvents {
  ping: () => void;
}

export interface SocketData {}
