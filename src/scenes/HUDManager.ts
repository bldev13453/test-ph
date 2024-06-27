import { GameObjects, Scene, Events } from "phaser";
import { EventBus } from "./EventBus";
import { EVENTS } from "./events";
import { IAppState } from "./AppState";

// https://www.youtube.com/watch?v=G3GrBuTFJbI&t=1s
export class HUDManager extends Scene {
  private hearts: GameObjects.Group;
  public startText: GameObjects.Text;
  private coinIcon: GameObjects.Image;
  private coinsCountText: GameObjects.Text;
  private pauseText: GameObjects.Text;
  private pauseButton: GameObjects.Image;
  private boostsButton: GameObjects.Image;
  private friendsButton: GameObjects.Image;
  private eventBus: Events.EventEmitter;
  constructor(private readonly appState: IAppState) {
    super("HUD");
    this.eventBus = EventBus;
  }
  create(): void {
    this.scene.bringToTop();

    this.displayCoins();
    this.showHearts();
    this.showStartText();
    this.showBoostsButton();
    this.eventBus.on(EVENTS.START_GAME, () => {
      this.hideStartText();
      this.showPauseButton();
      this.hideBoostsButton();
    });
    this.eventBus.on(EVENTS.HIT, () => {
      this.handleDeath();
    });
    this.eventBus.on(EVENTS.FALL, () => {
      this.handleDeath();
    });
    this.eventBus.on(EVENTS.COIN_COLLECTED, (count: number) => {
      this.updateCoinsCount(count);
    });
  }

  update() {}

  private get coinsCount(): number {
    return this.appState.getGameProp("tokenAmount") || 0;
  }

  private get livesCount(): number {
    return this.appState.getGameProp("hpAmount") || 3;
  }

  private recalculateCoinPosition(): void {
    const { width } = this.scale;
    const coinWidth = this.coinIcon.displayWidth + 10;
    const countWidth = this.coinsCountText.width;
    const totalWidth = coinWidth + countWidth + 20; // 20px padding between coin and count
    this.coinIcon.setPosition(width - coinWidth, 28);
    this.coinsCountText.setPosition(width - totalWidth, 23);
  }

  private displayCoins(): void {
    this.coinIcon = this.add.image(0, 0, "coin").setScale(0.3);
    this.coinsCountText = this.add
      .text(0, 0, this.coinsCount.toString(), {
        fontSize: "12px",
        fontFamily: '"Press Start 2P"',
      })
      .setDepth(2);
    this.recalculateCoinPosition();
  }

  handleDeath() {
    this.showStartText();
    this.hidePauseButton();
    this.showBoostsButton();
    this.decreaseHearts();
    this.scene.restart();
  }

  public updateCoinsCount(count: number): void {
    this.coinsCountText.setText(count.toString());
    this.recalculateCoinPosition();
  }

  showHearts(): void {
    this.hearts = this.add.group({
      key: "heart",
      repeat: this.livesCount - 1,
      setScale: { x: 0.3, y: 0.3 },
      setXY: { x: 30, y: 30, stepX: 22 },
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

  decreaseHearts(): void {
    const heart = this.lastHeart;
    if (!heart) {
      this.showHearts();
      return;
    }
    heart.destroy();
  }

  public showStartText(): void {
    this.startText = this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2,
        "tap to start",
        {
          fontSize: "24px",
          fontFamily: '"Press Start 2P"',
        }
      )
      .setOrigin(0.5);
    this.startText.setScrollFactor(0);
  }

  public hideStartText(): void {
    this.startText.destroy();
  }

  private showPauseButton(): void {
    this.pauseButton = this.add
      .image(
        this.cameras.main.worldView.x + this.cameras.main.width - 35,
        this.cameras.main.worldView.y + this.cameras.main.height - 35,
        "pause-button"
      )
      .setScale(0.25)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.pauseText?.active) {
          this.unpauseGame();
        } else {
          this.pauseGame();
        }
      });
  }

  private showBoostsButton(): void {
    this.boostsButton = this.add
      .image(
        62,
        this.cameras.main.worldView.y + this.cameras.main.height - 30,
        "boosts-button"
      )
      .setScale(0.12)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.launch("Boosts");
        this.scene.stop("HUD").stop("Game");
      });
  }

  private hideBoostsButton(): void {
    this.boostsButton?.destroy();
  }

  private hidePauseButton(): void {
    this.pauseButton?.destroy();
  }

  private pauseGame() {
    this.eventBus.emit(EVENTS.PAUSE_GAME);
    this.pauseText = this.add
      .text(
        this.cameras.main.worldView.x + this.cameras.main.width / 2,
        this.cameras.main.worldView.y + this.cameras.main.height / 2,
        "PAUSED",
        {
          fontSize: "32px",
          fontFamily: '"Press Start 2P"',
        }
      )
      .setDepth(4)
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  private unpauseGame() {
    this.pauseText.destroy();
    this.eventBus.emit(EVENTS.RESUME_GAME);
  }

  public get lastHeart(): Phaser.GameObjects.GameObject | undefined {
    return this.hearts.getChildren().at(-1);
  }
}
