import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("background", "assets/bg.png");
    this.load.image("player", "assets/player.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("spike", "assets/spike.png");
    this.load.image("coin", "assets/coin.png");
    this.load.audio("coin", "audio/coin.mp3");
    this.load.spritesheet("character_sprite", "assets/character_sprite.png", {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  create() {
    this.scene.start("Preloader");
    if (window?.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }
}
