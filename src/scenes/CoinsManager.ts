import { Physics } from "phaser";
import { Game } from "./Game";
import { EVENTS } from "./events";

export class CoinsManager {
  coinsCount: number;

  constructor(readonly scene: Game) {
    this.coinsCount = this.scene.appState.getGameProp("tokenAmount") || 0;
  }

  createCoin = (x: number, y: number): void => {
    const coin = this.scene.physics.add
      .sprite(x, y, "coin")
      .setScale(0.3)
      .setDepth(2);
    this.scene.physics.add.overlap(
      this.scene.heroManager.sprite,
      coin,
      this.collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this.scene
    );
  };

  collectCoin = (
    hero: Physics.Arcade.Sprite,
    coin: Physics.Arcade.Sprite
  ): void => {
    this.coinsCount++;
    this.scene.appState.setGameProp("tokenAmount", this.coinsCount);

    this.scene.sound?.play("coin");
    coin.disableBody(true, false);

    this.scene.tweens.add({
      targets: coin,
      y: coin.y - 100,
      alpha: 0,
      ease: "Power1",
      duration: 800,
      onComplete: () => {
        coin.destroy();
      },
    });
    this.scene.eventBus.emit(EVENTS.COIN_COLLECTED, this.coinsCount);
  };
}
