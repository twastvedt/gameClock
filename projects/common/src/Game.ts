import { Player } from "./Player";
import { GameSettings } from "./GameSettings";

export const Local = "local";

export class Game {
  name = Local;
  activeId?: string;

  /**
   * Timestamp of beginning of current turn.
   */
  turnStart: number | undefined = undefined;
  paused = false;
  players: Record<string, Player> = {};
  order: string[] = [];
  settings = new GameSettings();

  static makeDefault() {
    const game = new Game();

    [...Array(5).keys()].forEach((i) => game.addPlayer(`Player ${i}`));

    return game;
  }

  activePlayer() {
    if (!this.activeId) {
      this.activeId = this.order[0];
    }

    const player = this.players[this.activeId];

    if (!player) {
      throw new Error("Could not find player");
    }

    return player;
  }

  /**
   * Move to next player.
   * @param time Time at which the turn changed.
   * @returns Changes to game state.
   */
  nextTurn(time?: number): Partial<Game> {
    time ??= Date.now();
    const activePlayer = this.activePlayer();

    if (this.turnStart !== undefined) {
      activePlayer.time = Math.max(
        activePlayer.time - (time - this.turnStart) / 1000,
        0
      );
    }

    activePlayer.time = Math.min(
      activePlayer.time + this.settings.addTime,
      this.settings.maxTime
    );

    const index = this.order.indexOf(activePlayer.id);
    this.activeId = this.order[(index + 1) % this.order.length];
    this.turnStart = time;

    return {
      players: { [activePlayer.id]: activePlayer },
      activeId: this.activeId,
      turnStart: time,
    };
  }

  togglePause(time?: number): Partial<Game> | undefined {
    if (this.paused) {
      return this.play(time);
    } else {
      return this.pause(time);
    }
  }

  pause(time?: number): Partial<Game> | undefined {
    if (!this.paused) {
      this.paused = true;

      if (this.activeId !== undefined && this.turnStart !== undefined) {
        const activePlayer = this.activePlayer();

        activePlayer.time -= (time ?? Date.now() - this.turnStart) / 1000;
        this.turnStart = undefined;

        return {
          players: { [activePlayer.id]: activePlayer },
          turnStart: undefined,
          paused: true,
        };
      }

      return { paused: true };
    }
  }

  play(time?: number): Partial<Game> | undefined {
    if (this.paused || this.turnStart === undefined) {
      this.paused = false;
      this.turnStart = time ?? Date.now();

      return {
        paused: false,
        turnStart: this.turnStart,
      };
    }
  }

  update(): number | undefined {
    if (this.paused || this.turnStart === undefined) {
      return undefined;
    }

    const time =
      this.activePlayer().time - (Date.now() - this.turnStart) / 1000;

    if (time <= 0.1) {
      this.nextTurn();
      return;
    }

    return time;
  }

  addPlayer(name?: string): Partial<Game> {
    name ??= "Player";
    const id = Game.makeId();
    const player = {
      id,
      name,
      time: this.settings.maxTime,
    };

    this.players[id] = player;

    this.order.push(id);

    const changes: Partial<Game> = {
      order: this.order,
      players: { [id]: player },
    };

    if (!this.activeId) {
      this.activeId = id;
      changes.activeId = id;
    }

    return changes;
  }

  removePlayer(id: string) {
    if (this.players[id]) {
      delete this.players[id];
      this.order.splice(this.order.indexOf(id), 1);
    } else {
      throw new Error("Could not find player to remove.");
    }
  }

  private static makeId() {
    return (Date.now() + Math.random()).toString();
  }
}
