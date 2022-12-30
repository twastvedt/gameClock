import { Game } from "./Game";

export interface ServerEvents {
  update: (changes: Partial<Game>) => void;
  initialize: () => void;
}

export interface ClientEvents {
  update: (changes: Partial<Game>) => void;
  setRoom: (room: string, response: (game: Game) => void) => void;
  newRoom: (response: (game: Game) => void) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ServerSideEvents {
  ping: () => void;
}

export interface SocketData {}
