import { Scene } from "phaser";
import appState from "./State";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    // Load image assets
    this.load.image("background", "assets/skyBg.png");
    this.load.image("platform", "assets/platform.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("spike", "assets/spike.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("boosts-button", "assets/boosts-button.png");
    this.load.image("friends-button", "assets/friends-button.png");
    this.load.image("pause-button", "assets/pause-button.png");
    this.load.image("settings-button", "assets/settings-button.png");
    this.load.image("back-button", "assets/back-button.png");

    this.load.image("game-boosts-button", "assets/gameBoosts-button.png");
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
    this.load.spritesheet("hero_walk_sprite", "assets/hero_walk_sprite.png", {
      frameWidth: 296,
      frameHeight: 208,
    });
    this.load.spritesheet("hero_jump_sprite", "assets/hero_jump_sprite.png", {
      frameWidth: 296,
      frameHeight: 209,
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
