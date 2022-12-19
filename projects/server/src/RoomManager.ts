import { Game } from "../../common/src/Game";
import { randomBytes } from "crypto";

const maxRooms = parseInt(process.env.MAX_ROOMS ?? "100");
const rooms: Map<string, Game> = new Map();

function getName() {
  let name;

  do {
    name = randomBytes(6).toString("hex");
  } while (rooms.has(name));

  return name;
}

export function getRoom(name?: string) {
  name ??= getName();

  let room = rooms.get(name);

  if (!room) {
    if (rooms.size < maxRooms) {
      room = Game.makeDefault();

      rooms.set(name, room);
    } else {
      throw new Error("Max rooms exceeded");
    }
  }

  return room;
}
