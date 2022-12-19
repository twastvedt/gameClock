import { Game } from "./Game";

export interface ServerToClientEvents {
  update: (state: Partial<Game>) => void;
  initialize: (state: Game) => void;
}

export interface ClientToServerEvents {
  update: (state: Partial<Game>) => void;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IntraServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
