import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "assets/skyBg.png");
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("spike", "assets/spike.png");
    this.load.image("coin", "assets/coin.png");
    this.load.audio("coin", "audio/coin.mp3");
    this.load.spritesheet(
      "character_walk_sprite",
      "assets/character_walk_sprite.png",
      {
        frameWidth: 255,
        frameHeight: 169,
      }
    );
    this.load.spritesheet(
      "character_jump_sprite",
      "assets/character_jump_sprite.png",
      {
        frameWidth: 256,
        frameHeight: 169,
      }
    );
  }

  create() {
    this.scene.start("Preloader");
  }
}
