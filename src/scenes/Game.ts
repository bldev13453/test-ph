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
    this.eventBus = EventBus;
  }

  init(): void {}
  create(): void {
    this.gameState = "start";
    this.addBackground();
    this.heroManager = new HeroManager(this);
    this.coinsManager = new CoinsManager(this);
    this.platformManager = new PlatformManager(this);

    this.input.on("pointerdown", this.handleClick, this);
    this.eventBus.on(EVENTS.PAUSE_GAME, () => {
      this.scene.pause();
    });
    this.eventBus.on(EVENTS.RESUME_GAME, () => {
      this.scene.resume();
    });
    this.eventBus.on(EVENTS.FALL, () => {
      this.restartScene();
    });
    this.eventBus.on(EVENTS.HIT, () => {
      this.restartScene();
    });
  }

  private addBackground(): void {
    const { width, height } = this.scale;
    let x = 1000;
    for (let i = 0; i < 5; i++) {
      const bg = this.add.image(x, this.screenCenterY, "background");
      bg.setDepth(1);
      bg.setScale(Math.max(width / bg.width, height / bg.height) - 0.05);
      bg.setScrollFactor(0.05);

      x += bg.displayWidth;
    }
  }

  start(): void {
    this.eventBus.emit(EVENTS.START_GAME);
    this.gameState = "play";
    this.heroManager.start();
    this.platformManager.startGeneratePlatforms();
  }

  update(): void {
    if (this.gameState === "play") {
      this.platformManager.update();
      this.heroManager.updateAnimations();
    }
  }

  restartScene(): void {
    this.gameState = "start";
    this.scene.restart();
  }

  handleClick(): void {
    if (this.gameState === "start") {
      this.start();
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
