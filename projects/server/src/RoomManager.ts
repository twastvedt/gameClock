import { Game, Local } from "../../common/src/Game";
import { randomBytes } from "crypto";

const maxRooms = parseInt(process.env.MAX_ROOMS ?? "100");
const games: Map<string, Game> = new Map();

export function getName() {
  let name;

  do {
    name = randomBytes(6).toString("hex");
  } while (games.has(name));

  console.debug(`New room: ${name}. ${games.size} rooms total.`);

  return name;
}

export function validateName(name: string) {
  return name?.length > 0 && name !== Local;
}

export function getRoom(name?: string) {
  name ??= getName();

  let game = games.get(name);

  if (!game) {
    if (games.size < maxRooms) {
      if (!validateName(name)) {
        throw new Error("Invalid name");
      }

      game = Game.makeDefault();
      game.name = name;

      games.set(name, game);
    } else {
      throw new Error("Max rooms exceeded");
    }
  }

  return game;
}
