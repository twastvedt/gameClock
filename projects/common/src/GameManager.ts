import { Game } from "./Game";

export class GameManager {
  private updateTimer?: NodeJS.Timer;

  constructor(public game: Game) {}

  startUpdates(interval = 1000) {
    this.updateTimer = setInterval(() => {
      this.game.update();
    }, interval);
  }

  stopUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }
}
