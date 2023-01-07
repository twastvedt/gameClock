import { Game } from "./Game";

export class GameManager {
  private updateTimer?: NodeJS.Timer;

  constructor(public game: Game) {}

  startUpdates(interval = 1000) {
    this.updateTimer = setInterval(() => {
      try {
        this.game.update();
      } catch (error) {
        console.error(
          `Stopping scheduled updates of ${this.game.name}: \n${error}`
        );
        this.stopUpdates();
      }
    }, interval);
  }

  stopUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      delete this.updateTimer;
    }
  }
}
