import { Scene } from "phaser";
import appState from "./AppState";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Load image assets
    this.load.image("background", "assets/sky.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("boosts-button", "assets/boosts-button.png");
    this.load.image("friends-button", "assets/friends-button.png");
    this.load.image("pause-button", "assets/pause-button.png");
    this.load.image("settings-button", "assets/settings-button.png");
    this.load.image("back-button", "assets/back-button.png");
    this.load.image("card-base", "assets/card-base.png");
    this.load.image("card-doge", "assets/card-doge.png");
    this.load.image("game-boosts-button", "assets/gameBoosts-button.png");
    this.load.image("bush", "assets/bush.png");
    this.load.image("menu-ground", "assets/menu-ground.png");
    this.load.image("bubble-shield", "assets/bubble-shield.png");

    this.load.image(
      "game-boosts-button-hover",
      "assets/gameBoosts-buttonHover.png"
    );
    this.load.image("meme-boosts-button", "assets/memeBoosts-button.png");
    this.load.image(
      "meme-boosts-button-hover",
      "assets/memeBoosts-buttonHover.png"
    );
    // Load audio assets
    this.load.audio("coin", "audio/coin.mp3");
    this.load.audio("jump", "audio/jumpSound.mp3");

    // Load spritesheets
    this.load.spritesheet("hero-walk-sprite", "assets/hero-walk-sprite.png", {
      frameWidth: 296,
      frameHeight: 208,
    });
    this.load.spritesheet("hero-jump-sprite", "assets/hero-jump-sprite.png", {
      frameWidth: 296,
      frameHeight: 209,
    });
    this.load.spritesheet("hero-sleep-sprite", "assets/hero-sleep-sprite.png", {
      frameWidth: 296,
      frameHeight: 209,
    });

    this.load.spritesheet("doge-sprite", "assets/doge-sprite.png", {
      frameWidth: 540,
      frameHeight: 480,
    });
    this.load.spritesheet("pepe-sprite", "assets/pepe-sprite.png", {
      frameWidth: 320,
      frameHeight: 440,
    });
    this.load.spritesheet("mew-sprite", "assets/mew-sprite.png", {
      frameWidth: 360,
      frameHeight: 510,
    });
  }

  async create() {
    // Load fonts
    await new Promise((resolve) => {
      WebFont.load({
        google: {
          families: ["PressStart2P"],
        },
        active() {
          resolve(null);
        },
      });
    });

    await appState.initState();
    this.scene.launch("Preloader").launch("Game").launch("HUD");
  }
}
