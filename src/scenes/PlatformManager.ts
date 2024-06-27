import { Physics, GameObjects, Math as PhaserMath } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";
import { EVENTS } from "./events";

export class PlatformManager {
  private platforms: Physics.Arcade.StaticGroup;
  private platformGroup: GameObjects.Group;
  private spikes: Physics.Arcade.StaticGroup;
  private isHeroDamaged: boolean;

  constructor(private scene: Game) {
    const { height, width } = this.scene.scale;
    this.platforms = this.scene.physics.add.staticGroup();
    this.platformGroup = this.scene.add.group({
      removeCallback: (platform: GameObjects.GameObject) => {
        this.platforms.killAndHide(platform);
      },
    });
    this.spikes = this.scene.physics.add.staticGroup();
    this.isHeroDamaged = false;

    this.createPlatform(-width, height - 50, width * 0.05);

    this.scene.physics.add.collider(
      this.scene.heroManager.sprite,
      this.staticGroup
    );
    this.scene.physics.add.overlap(
      this.scene.heroManager.sprite,
      this.spikesGroup,
      this.hitSpike as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  public createPlatform(x: number, y: number, platformLength = 4): void {
    let lastX = x;
    for (let i = 0; i < platformLength; i++) {
      const block = this.platforms.create(lastX, y, "platform");
      block.setOrigin(0, 1);
      block.setScale(CONFIG.scale);
      block.refreshBody();
      block.body.checkCollision.up = true;
      block.body.checkCollision.down = false;
      block.body.checkCollision.left = false;
      block.body.checkCollision.right = false;
      this.platformGroup.add(block);
      block.setDepth(1);
      lastX += block.displayWidth;

      if (
        this.scene.heroManager &&
        this.scene.heroManager.sprite.x > CONFIG.startGenerateItemsCoordinateX
      ) {
        if (PhaserMath.Between(0, 1) === 1) {
          this.scene.coinsManager.createCoin(
            lastX - block.displayWidth / 2,
            y - 50
          );
        } else if (PhaserMath.Between(0, 10) === 1 && platformLength > 4) {
          this.createSpikes(
            lastX - block.displayWidth,
            y - block.displayHeight,
            3
          );
        } else if (PhaserMath.Between(0, 7) === 1 && platformLength > 3) {
          this.createNpc(lastX - block.displayWidth, y - 70);
        }
      }
    }
  }

  private createNpc(x: number, y: number) {
    const npcType = PhaserMath.Between(1, 2) === 1 ? "doge" : "pepe";
    const sprite = `${npcType}-sprite`;
    const yPosition = npcType === "doge" ? y : y + 5;
    const npc = this.scene.physics.add
      .sprite(x, yPosition, sprite)
      .setScale(0.15)
      .setDepth(2);
  }

  public createSpikes(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      this.spikes
        .create(x + i * (64 * CONFIG.scale), y, "spike")
        .setDepth(2)
        .setOrigin(0, 1)
        .setScale(CONFIG.scale)
        .refreshBody();
    }
  }

  private hitSpike(
    hero: Physics.Arcade.Sprite,
    spike: Physics.Arcade.Sprite
  ): void {
    if (!this.isHeroDamaged) {
      // Check if the hero has already been damaged
      this.isHeroDamaged = true; // Set the flag
      hero.setTint(0xff0000);
      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          hero.clearTint();
        },
        callbackScope: this,
      });
      this.scene.eventBus.emit(EVENTS.HIT);
    }
  }

  public update(): void {
    this.platformGroup
      .getChildren()
      .forEach((platform: GameObjects.GameObject) => {
        if (
          (platform as GameObjects.Image).x <
          this.scene.cameras.main.scrollX -
            (platform as GameObjects.Image).displayWidth
        ) {
          this.platformGroup.killAndHide(platform);
          this.platformGroup.remove(platform);
        }
      });

    const lastPlatform = this.platformGroup.getLast(true) as GameObjects.Image;

    const lastPlatformY = lastPlatform ? lastPlatform.y : 0;
    if (this.scene.heroManager.sprite.y > lastPlatformY + 500) {
      this.handleFall();
    }
  }

  private handleFall(): void {
    this.scene.eventBus.emit(EVENTS.FALL);
  }

  public createMorePlatforms(): void {
    const { width } = this.scene.scale;
    const lastPlatform = this.platformGroup.getLast(true) as GameObjects.Image;

    if (
      lastPlatform &&
      lastPlatform.x < this.scene.cameras.main.scrollX + width
    ) {
      const platformsCount = PhaserMath.Between(1, 3);
      let previousX = lastPlatform.x + lastPlatform.displayWidth;

      for (let i = 0; i < platformsCount; i++) {
        const gap = PhaserMath.Between(
          CONFIG.platformSizeTexture * CONFIG.scale,
          CONFIG.platformSizeTexture * CONFIG.scale * 3
        );
        const newX = previousX + gap;
        const newYDirection = PhaserMath.Between(0, 1) === 0 ? -1 : 1;
        const newY =
          lastPlatform.y + newYDirection * PhaserMath.Between(20, 40);
        const platformLength = PhaserMath.Between(4, 6);

        this.createPlatform(newX, newY, platformLength);
        previousX =
          newX +
          (this.platforms.getChildren()[0] as GameObjects.Image).displayWidth *
            platformLength;
      }
    }
  }

  public startGeneratePlatforms(): void {
    this.scene.time.addEvent({
      delay: 500,
      callback: this.createMorePlatforms,
      callbackScope: this,
      loop: true,
    });
  }

  public get group(): GameObjects.Group {
    return this.platformGroup;
  }

  public get staticGroup(): Physics.Arcade.StaticGroup {
    return this.platforms;
  }

  public get spikesGroup(): Physics.Arcade.StaticGroup {
    return this.spikes;
  }
}
