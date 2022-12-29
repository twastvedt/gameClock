import { Player } from "./Player";
import { GameSettings } from "./GameSettings";

export const Local = "local";

export class Game {
  activeId?: string;

  /**
   * Timestamp of beginning of current turn.
   */
  turnStart: number | undefined = undefined;
  paused = true;
  players: Record<string, Player> = {};
  order: string[] = [];
  settings = new GameSettings();

  constructor(public name = Local) {}

  static makeDefault(name?: string) {
    const game = new Game(name);

    [...Array(5).keys()].forEach((i) => game.addPlayer(`Player ${i}`));

    return game;
  }

  static clone(game: Game) {
    return Object.assign(new Game(game.name), game);
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
   * @returns Changes to game state.
   */
  nextTurn(): Partial<Game> {
    const time = Date.now();
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

  togglePause(): Partial<Game> | undefined {
    if (this.paused) {
      return this.play();
    } else {
      return this.pause();
    }
  }

  setPause(paused?: boolean): Partial<Game> | undefined {
    switch (paused) {
      case true:
        return this.pause();
      case false:
        return this.play();
      case undefined:
        return this.togglePause();
    }
  }

  pause(): Partial<Game> | undefined {
    if (!this.paused) {
      this.paused = true;

      if (this.activeId !== undefined && this.turnStart !== undefined) {
        const activePlayer = this.activePlayer();

        activePlayer.time -= (Date.now() - this.turnStart) / 1000;
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

  play(): Partial<Game> | undefined {
    if (this.paused || this.turnStart === undefined) {
      this.paused = false;
      this.turnStart = Date.now();

      return {
        paused: false,
        turnStart: this.turnStart,
      };
    }
  }

  update(): number | undefined {
    if (this.paused || this.turnStart === undefined) {
      return this.activePlayer().time;
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
      time: this.settings.startTime,
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
