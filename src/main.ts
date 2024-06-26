import { Boosts } from "./scenes/Boosts";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { HUDManager } from "./scenes/HUDManager";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";
import appState from "./scenes/State";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game-container",
  backgroundColor: "#028af8",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: "arcade",
  },
  scene: [
    Boot,
    Preloader,
    MainMenu,
    new HUDManager(appState),
    new MainGame(appState),
    new Boosts(appState),
  ],
};

export default new Game(config);
