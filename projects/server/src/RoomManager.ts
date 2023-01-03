import { Game, Local } from "../../common/src/Game";
import { GameManager } from "../../common/src/GameManager";
import { randomBytes } from "crypto";

const maxRooms = parseInt(process.env.MAX_ROOMS ?? "100");
const games: Map<string, GameManager> = new Map();

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

    let manager = games.get(name);

    if (!manager) {
      manager = new GameManager(Game.makeDefault(name));
      manager.startUpdates();
      games.set(name, manager);
      console.debug(`New room: ${name}. ${games.size} rooms total.`);
    }

    return manager.game;
  } else {
    throw new Error("Max rooms exceeded");
  }
}

export function removeGame(name: string) {
  const manager = games.get(name);

  if (manager) {
    manager.stopUpdates();
    games.delete(name);

    console.debug(`Removing room: ${name}. ${games.size} rooms remain.`);

    return true;
  }

  return false;
}
