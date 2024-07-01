import { Scene, Events } from "phaser";
import { HeroManager } from "./HeroManager";
import { PlatformManager } from "./PlatformManager";
import { HUDManager } from "./HUDManager";
import { CoinsManager } from "./CoinsManager";
import { EventBus } from "./EventBus";
import { EVENTS } from "./events";
import { IAppState } from "./AppState";
export class Game extends Scene {
  heroManager: HeroManager;
  platformManager: PlatformManager;
  coinsManager: CoinsManager;
  hudManager: HUDManager;
  gameState: "start" | "play" | "pause" | "over" = "start";
  eventBus: Events.EventEmitter;
  constructor(readonly appState: IAppState) {
    super("Game");
  }

  create(): void {
    this.eventBus = EventBus;

    this.gameState = "start";
    this.addBackground();

    this.heroManager = new HeroManager(this);
    this.coinsManager = new CoinsManager(this);
    this.platformManager = new PlatformManager(this);

    this.input.on("pointerdown", this.handleClick, this);
    this.eventBus.on(EVENTS.START_GAME, () => {
      this.start();
    });
    this.eventBus.on(EVENTS.PAUSE_GAME, () => {
      this.scene.pause();
    });
    this.eventBus.on(EVENTS.RESUME_GAME, () => {
      this.scene.resume();
    });
  }

  private addBackground(): void {
    const { width, height } = this.scale;
    let x = 0;
    for (let i = 0; i < 5; i++) {
      const bg = this.add.image(x, this.screenCenterY - 20, "background");
      bg.setDepth(1);
      bg.setScale(Math.max(width / bg.width, height / bg.height) - 0.05);
      bg.setScrollFactor(0.05, 0);

      x += bg.displayWidth;
    }
  }

  start(): void {
    this.gameState = "play";
    this.heroManager.start();
  }

  update(): void {
    if (this.gameState === "play") {
      this.platformManager.update();
      this.heroManager.update();
      this.heroManager.updateAnimations();
    }
  }

  restartScene(): void {
    this.gameState = "start";
    this.eventBus.emit(EVENTS.RESTART_GAME);
    this.eventBus.destroy();
    this.scene.restart();
  }

  handleClick(): void {
    if (this.gameState === "start") {
      return;
    } else {
      this.heroManager.jump();
    }
  }

  get screenCenterX(): number {
    return this.cameras.main.worldView.x + this.cameras.main.width / 2;
  }

  get screenCenterY(): number {
    return this.cameras.main.worldView.y + this.cameras.main.height / 2;
  }
}
