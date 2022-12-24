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
  players: Map<string, Player> = new Map();
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

    const player = this.players.get(this.activeId);

    if (!player) {
      throw new Error("Could not find player");
    }

    return player;
  }

  /**
   * Move to next player.
   * @returns Id of new player.
   */
  nextTurn(): string {
    const activePlayer = this.activePlayer();

    if (this.turnStart !== undefined) {
      activePlayer.time = Math.max(
        activePlayer.time - (Date.now() - this.turnStart) / 1000,
        0
      );
    }

    activePlayer.time = Math.min(
      activePlayer.time + this.settings.addTime,
      this.settings.maxTime
    );

    const index = this.order.indexOf(activePlayer.id);
    this.activeId = this.order[(index + 1) % this.order.length];
    this.turnStart = Date.now();

    return this.activeId;
  }

  togglePause(): void {
    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  pause(): void {
    if (!this.paused) {
      this.paused = true;

      if (this.activeId !== undefined && this.turnStart !== undefined) {
        this.activePlayer().time -= (Date.now() - this.turnStart) / 1000;
      }
    }
  }

  play(): void {
    if (this.paused || this.turnStart === undefined) {
      this.paused = false;
      this.turnStart = Date.now();
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

  addPlayer(name?: string) {
    name ??= "Player";
    const id = Game.makeId();

    this.players.set(id, {
      id,
      name,
      time: this.settings.maxTime,
    });

    this.order.push(id);

    if (!this.activeId) {
      this.activeId = id;
    }
  }

  removePlayer(id: string) {
    if (this.players.delete(id)) {
      this.order.splice(this.order.indexOf(id), 1);
    } else {
      throw new Error("Could not find player to remove.");
    }
  }

  private static makeId() {
    return (Date.now() + Math.random()).toString();
  }
}
