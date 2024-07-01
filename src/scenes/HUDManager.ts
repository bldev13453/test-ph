import { GameObjects, Scene, Events } from "phaser";
import { EventBus } from "./EventBus";
import { EVENTS } from "./events";
import { IAppState, useLocalStorage } from "./AppState";

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

  private settingsButton: GameObjects.Image;
  private settingsContainer: GameObjects.Container;
  private soundIcon: GameObjects.Image;
  private soundText: GameObjects.Text;
  private closeButton: GameObjects.Text;
  private buttonsContainer: GameObjects.Container; // New container for buttons

  constructor(private readonly appState: IAppState) {
    super("HUD");
    this.eventBus = EventBus;
  }

  create(): void {
    this.scene.bringToTop();
    this.displayCoins();
    this.showHearts();
    this.showStartText();
    this.createButtonsContainer(); // Create the buttons container
    this.createSettingsContainer();
    this.eventBus.on(EVENTS.START_GAME, () => {
      this.hideStartText();
      this.hideSettingsButton();
      this.showPauseButton();
      this.hideBoostsButton();
      this.hideButtonsContainer(); // Hide the container when game starts
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
    this.eventBus.on(EVENTS.RESTART_GAME, () => {
      this.scene.restart();
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
    this.decreaseHearts();
    this.showButtonsContainer(); // Show the container when the player dies
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
        this.cameras.main.worldView.y + this.cameras.main.height / 2 + 70,
        "tap to start",
        {
          fontSize: "24px",
          fontFamily: '"Press Start 2P"',
          fixedHeight: 200,
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.eventBus.emit(EVENTS.START_GAME);
      });
    this.startText.setScrollFactor(0);
  }

  public hideStartText(): void {
    this.startText.destroy();
  }

  private createButtonsContainer(): void {
    const padding = 15;
    const buttonGap = 15;
    const { width, height } = this.scale;

    this.buttonsContainer = this.add.container(padding, height - padding);

    // Create and add friendsButton
    this.friendsButton = this.add
      .image(0, 0, "friends-button")
      .setScale(0.13)
      .setOrigin(0, 1) // Set origin to bottom left
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        // Action for friendsButton
      });

    // Create and add boostsButton
    this.boostsButton = this.add
      .image(buttonGap + this.friendsButton.width * 0.12, 0, "boosts-button")
      .setScale(0.13)
      .setOrigin(0, 1) // Set origin to bottom left
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.launch("Boosts");
        this.scene.stop("HUD").stop("Game");
      });

    // Create and add settingsButton
    this.settingsButton = this.add
      .image(width - padding - 35, 0, "settings-button")
      .setScale(0.25)
      .setOrigin(0.5, 1) // Set origin to bottom right
      .setScrollFactor(0)
      .setInteractive()
      .on("pointerdown", () => {
        this.showSettings();
      })
      .on("pointerover", () => {
        this.settingsButton?.setTexture("settings-button-hover");
      })
      .on("pointerout", () => {
        this.settingsButton?.setTexture("settings-button");
      });

    // Add buttons to container
    this.buttonsContainer.add([
      this.friendsButton,
      this.boostsButton,
      this.settingsButton,
    ]);
  }

  private hideButtonsContainer(): void {
    this.buttonsContainer.setVisible(false);
  }

  private showButtonsContainer(): void {
    this.buttonsContainer.setVisible(true);
  }

  private hideBoostsButton(): void {
    this.boostsButton?.destroy();
  }

  // Settings
  private showSettingsButton(): void {
    // Moved settingsButton creation to createButtonsContainer method
  }

  private hideSettingsButton(): void {
    this.settingsButton?.destroy();
  }

  private toggleSound(): void {
    this.game.sound.mute = !this.getSoundMuted();

    useLocalStorage().setPersistentProp(
      "soundMuted",
      String(!this.getSoundMuted()) // Состояние this.game.sound.mute не сохраняется корректно, поэтому используется костыль
    );
    this.appState.setGameProp("soundMuted", !this.getSoundMuted());
  }

  private getSoundMuted() {
    return this.appState.getGameProp("soundMuted");
  }

  private createSettingsContainer(): void {
    this.game.sound.setMute(this.getSoundMuted());

    this.settingsContainer = this.add.container(
      this.cameras.main.worldView.x + this.cameras.main.width / 2,
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    );

    // Create a rounded rectangle as the background with border
    const graphics = this.add.graphics();
    const borderRadius = 8;
    const rectWidth = 300;
    const rectHeight = 200;

    graphics.lineStyle(2, 0x000000, 1); // border color and thickness
    graphics.fillStyle(0xffffff, 0.5); // background color

    graphics.strokeRoundedRect(
      -rectWidth / 2,
      -rectHeight / 2,
      rectWidth,
      rectHeight,
      borderRadius
    );
    graphics.fillRoundedRect(
      -rectWidth / 2,
      -rectHeight / 2,
      rectWidth,
      rectHeight,
      borderRadius
    );

    const settingsBackground = graphics;

    const iconName = this.getSoundMuted()
      ? "sound-off-button"
      : "sound-on-button";

    this.soundIcon = this.add
      .image(50, 0, iconName)
      .setScale(0.3)
      .setInteractive()
      .on("pointerdown", () => {
        this.toggleSound();

        this.soundIcon.setTexture(
          this.getSoundMuted() ? "sound-off-button" : "sound-on-button"
        );
      });
    this.soundText = this.add
      .text(-30, 0, "Sound:", {
        fontSize: "16px",
        fontFamily: '"Press Start 2P"',
      })
      .setOrigin(0.5);

    this.closeButton = this.add
      .text(rectWidth / 2, -rectHeight / 2, "X", {
        fontSize: "24px",
        fontFamily: '"Press Start 2P"',
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.hideSettings();
      })
      .setOrigin(0.5);

    this.settingsContainer.add([
      settingsBackground,
      this.soundIcon,
      this.soundText,
      this.closeButton,
    ]);
    this.settingsContainer.setVisible(false);
  }

  private showSettings(): void {
    this.settingsContainer.setVisible(true);
    this.hideStartText();
    this.hideSettingsButton();
  }

  private hideSettings(): void {
    this.settingsContainer.setVisible(false);
    this.showSettingsButton();
    this.showStartText();
  }

  // Pause

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
