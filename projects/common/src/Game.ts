import { Player } from "./Player";
import { GameSettings } from "./GameSettings";

export class Game {
  activeIndex = 0;

  /**
   * Timestamp of beginning of current turn.
   */
  turnStart: number | undefined = undefined;
  paused = false;
  players: Player[] = [];
  settings = new GameSettings();

  static makeDefault() {
    const game = new Game();

    game.players.push(
      ...[...Array(5).keys()].map((i) => ({
        name: `Player ${i}`,
        time: game.settings.maxTime,
      }))
    );

    return game;
  }

  activePlayer() {
    return this.players[this.activeIndex];
  }

  nextTurn(): void {
    const activePlayer = this.activePlayer();

    if (this.turnStart !== undefined) {
      activePlayer.time = Math.max(
        activePlayer.time - (Date.now() - this.turnStart),
        0
      );
    }

    activePlayer.time = Math.min(
      activePlayer.time + this.settings.addTime,
      this.settings.maxTime
    );

    this.activeIndex = (this.activeIndex + 1) % this.players.length;
    this.turnStart = Date.now();
  }

  pause(): void {
    this.paused = !this.paused;

    if (this.activeIndex !== undefined && this.turnStart !== undefined) {
      if (this.paused) {
        this.activePlayer().time -= Date.now() - this.turnStart;
      } else {
        this.turnStart = Date.now();
      }
    }
  }

  update(): number | undefined {
    if (this.paused || this.turnStart === undefined) {
      return undefined;
    }

    const time = this.activePlayer().time - (Date.now() - this.turnStart);

    if (time <= 0.1) {
      this.nextTurn();
      return;
    }

    return time;
  }
}
