import { Scene, Events } from "phaser";
import { HeroManager } from "./HeroManager";
import { PlatformManager } from "./PlatformManager";
import { HUDManager } from "./HUDManager";
import { CoinsManager } from "./CoinsManager";
import { EventBus } from "./EventBus";
import { EVENTS } from "./events";
import { IAppState } from "./State";
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
    const bg = this.add.image(
      this.screenCenterX,
      this.screenCenterY,
      "background"
    );
    bg.setDepth(1);
    const { width, height } = this.scale;
    bg.setScale(Math.max(width / bg.width, height / bg.height));
    bg.setScrollFactor(0);
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
