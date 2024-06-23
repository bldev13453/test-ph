import { GameObjects } from "phaser";
import { Game } from "./Game";

const COINS_TEXT_POSITION = {
  icon: {
    x: 200,
    y: 30,
  },
  text: {
    x: 250,
    y: 30,
  },
};
export class HUDManager {
  private hearts: GameObjects.Group;
  private positionText: GameObjects.Text;
  public startText: GameObjects.Text;
  private coins: GameObjects.Group;
  private coinsCountText: GameObjects.Text;
  constructor(readonly scene: Game) {}

  init() {
    this.positionText = this.scene.add.text(10, 50, "X: 0", {
      font: "16px Arial",
    });
    this.showCoins();
    this.showHearts();
  }

  private showCoins(): void {
    this.coins = this.scene.add.group({
      key: "coin",
      setXY: { x: COINS_TEXT_POSITION.icon.x, y: COINS_TEXT_POSITION.icon.y },
    });
    this.coins.getChildren().forEach((coin: GameObjects.GameObject) => {
      (coin as GameObjects.Image).setScrollFactor(0).setScale(0.3);
    });
    this.coinsCountText = this.scene.add.text(
      COINS_TEXT_POSITION.text.x,
      COINS_TEXT_POSITION.text.y,
      "0",
      {
        fontSize: "32px",
      }
    );
    this.coinsCountText.setOrigin(0.5);
    this.coinsCountText.setScrollFactor(0);
  }

  showHearts(): void {
    this.hearts = this.scene.add.group({
      key: "heart",
      repeat: 2,
      setXY: { x: 30, y: 30, stepX: 25 },
    });
  }
  setHpIcons(hp: number): void {
    this.hearts
      .getChildren()
      .slice(0, hp)
      .forEach((heart: GameObjects.GameObject) => {
        (heart as GameObjects.Image).setScrollFactor(0).setScale(0.3);
      });
  }

  public updateCoinsCount(count: number): void {
    this.coinsCountText.setText(": " + count.toString());
  }

  public updateHeroPosition(x: number): void {
    this.positionText.setText(`X: ${Math.floor(x)}`);
    this.positionText.setScrollFactor(0);
  }

  public showStartText(): void {
    this.startText = this.scene.add
      .text(
        this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2,
        this.scene.cameras.main.worldView.y +
          this.scene.cameras.main.height / 2,
        "tap to start",
        {
          fontSize: "32px",
        }
      )
      .setOrigin(0.5);
    this.startText.setScrollFactor(0);
  }

  decreaseHearts = (): void => {
    const heart = this.firstAliveHeart;
    if (!heart) return;
    heart.destroy();
  };

  public hideStartText(): void {
    this.startText.destroy();
  }

  public get firstAliveHeart(): Phaser.GameObjects.Sprite | null {
    return this.hearts.getFirstAlive();
  }
}
