import { Game, Local } from "../../common/src/Game";
import { randomBytes } from "crypto";

const maxRooms = parseInt(process.env.MAX_ROOMS ?? "100");
const games: Map<string, Game> = new Map();

export function validateName(name: string) {
  return name?.length > 0 && name !== Local;
}

export function getGame(name?: string) {
  if (games.size < maxRooms) {
    if (name) {
      if (!validateName(name)) {
        throw new Error("Invalid name");
      }
    } else {
      do {
        name = randomBytes(2).toString("hex");
      } while (games.has(name));
    }

    let game = games.get(name);

    if (!game) {
      game = Game.makeDefault(name);
      games.set(name, game);
      console.debug(`New room: ${name}. ${games.size} rooms total.`);
    }

    return game;
  } else {
    throw new Error("Max rooms exceeded");
  }
}
