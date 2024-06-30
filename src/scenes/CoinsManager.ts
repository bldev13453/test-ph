import { Physics, Types } from "phaser";
import { Game } from "./Game";
import { EVENTS } from "./events";

const COINS_LIMIT = 222;
export class CoinsManager {
  coinsCount: number;
  private runCoins = 0;
  private coins: Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
  constructor(readonly scene: Game) {
    this.coinsCount = this.scene.appState.getGameProp("tokenAmount") || 0;
  }

  createCoin = (x: number, y: number): void => {
    if (this.runCoins >= COINS_LIMIT) return;
    const coin = this.scene.physics.add
      .sprite(x, y, "coin")
      .setScale(0.3)
      .setDepth(2);

    this.coins.push(coin);

    this.scene.physics.add.overlap(
      this.scene.heroManager.sprite,
      coin,
      (hero, coin) =>
        this.collectCoin(
          hero as Physics.Arcade.Sprite,
          coin as Physics.Arcade.Sprite
        ),
      undefined,
      this.scene
    );

    this.scene.physics.world.on("worldstep", () => {
      const heroX = this.scene.heroManager.sprite.x;
      const heroY = this.scene.heroManager.sprite.y;
      const coinX = coin.x;
      const coinY = coin.y;

      // pull only coins in front of the player
      if (
        this.scene.heroManager.magnetBoosterActive &&
        Math.abs(coinX - heroX) <= 100 &&
        Math.abs(coinY - heroY) <= 100
      ) {
        this.scene.physics?.moveToObject(
          coin,
          this.scene.heroManager.sprite,
          500,
          100
        );
      }
    });
  };

  collectCoin(hero: Physics.Arcade.Sprite, coin: Physics.Arcade.Sprite): void {
    if (this.runCoins >= COINS_LIMIT) return;
    this.coinsCount++;

    this.scene.appState.setGameProp("tokenAmount", this.coinsCount);

    this.scene.sound?.play("coin");
    coin.disableBody(true, false);
    this.runCoins += 1;

    this.scene.eventBus.emit(EVENTS.COIN_COLLECTED, this.coinsCount);

    this.scene.tweens.add({
      targets: coin,
      y: coin.y - 100,
      alpha: 0,
      ease: "Power1",
      duration: 600,
      onComplete: () => {
        coin.disableBody(false, true);
      },
    });
    if (this.runCoins === COINS_LIMIT) {
      this.coins.forEach((coin) => {
        this.scene.tweens.add({
          targets: coin,
          y: coin.y - 100,
          alpha: 0,
          ease: "Power1",
          duration: 600,
          onComplete: () => {
            coin.disableBody(true, true);
          },
        });
      });
      this.scene.eventBus.emit(EVENTS.REACH_COINS_LIMIT);
    }
  }
}
