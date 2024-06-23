import { Scene } from "phaser";
import { HeroManager } from "./HeroManager";
import { PlatformManager } from "./PlatformManager";
import { HUDManager } from "./HUDManager";
import { CoinsManager } from "./CoinsManager";

export class Game extends Scene {
  heroManager: HeroManager;
  platformManager: PlatformManager;
  coinsManager: CoinsManager;
  hudManager: HUDManager;
  constructor() {
    super("Game");
    this.hudManager = new HUDManager(this);
  }

  create(): void {
    const bg = this.add.image(
      this.screenCenterX,
      this.screenCenterY,
      "background"
    );
    const { width, height } = this.scale;
    bg.setScale(Math.max(width / bg.width, height / bg.height));
    bg.setScrollFactor(0);
    this.hudManager.init();
    this.heroManager = new HeroManager(this);
    this.coinsManager = new CoinsManager(this);
    this.platformManager = new PlatformManager(this);
    this.hudManager.showStartText();

    this.input.on("pointerdown", this.handleClick, this);
  }

  start(): void {
    this.heroManager.start();
    this.platformManager.startGeneratePlatforms();
  }

  update(): void {
    this.platformManager.update();
    this.hudManager.updateHeroPosition(this.heroManager.sprite.x);
    if (!this.hudManager.startText.active) {
      this.heroManager.updateAnimations();
    }
  }

  restartScene(): void {
    this.scene.restart();
  }

  resetGame(): void {
    this.heroManager;
  }

  handleClick(): void {
    if (this.hudManager.startText?.active) {
      this.hudManager.hideStartText();
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
