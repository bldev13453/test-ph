import { Physics } from "phaser";
import { Game } from "./Game";

export class CoinsManager {
  coinsCount: number;

  constructor(readonly scene: Game) {
    this.coinsCount = scene.registry.get("coinsCount") || 0;
    this.scene.hudManager.updateCoinsCount(this.coinsCount);
  }

  createCoin = (x: number, y: number): void => {
    const coin = this.scene.physics.add.sprite(x, y, "coin");
    coin.setScale(0.3);
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
    this.scene.registry.set("coinsCount", this.coinsCount);

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
    this.scene.hudManager.updateCoinsCount(this.coinsCount);
  };
}
