import { Game } from "./Game";

export interface ServerEvents {
  update: (state: Partial<Game>) => void;
  initialize: (state: Game) => void;
}

export interface ClientEvents {
  update: (state: Partial<Game>) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ServerSideEvents {
  ping: () => void;
}

export interface SocketData {}
