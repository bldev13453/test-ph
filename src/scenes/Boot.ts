import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "assets/skyBg.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("spike", "assets/spike.png");
    this.load.image("coin", "assets/coin.png");
    this.load.audio("coin", "audio/coin.mp3");
    this.load.spritesheet("hero_walk_sprite", "assets/hero_walk_sprite.png", {
      frameWidth: 296,
      frameHeight: 208,
    });
    this.load.spritesheet("hero_jump_sprite", "assets/hero_jump_sprite.png", {
      frameWidth: 296,
      frameHeight: 209,
    });
  }

  create() {
    this.scene.start("Preloader");
  }
}
