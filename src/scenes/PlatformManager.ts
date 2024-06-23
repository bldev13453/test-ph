import { Physics, GameObjects, Math as PhaserMath } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";

export class PlatformManager {
  private platforms: Physics.Arcade.StaticGroup;
  private platformGroup: GameObjects.Group;
  private spikes: Physics.Arcade.StaticGroup;

  constructor(private scene: Game) {
    const { height, width } = this.scene.scale;
    this.platforms = this.scene.physics.add.staticGroup();
    this.platformGroup = this.scene.add.group({
      removeCallback: (platform: GameObjects.GameObject) => {
        this.platforms.killAndHide(platform);
      },
    });
    this.spikes = this.scene.physics.add.staticGroup();
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

  public createPlatform(x: number, y: number, platformLength = 3): void {
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
        } else if (PhaserMath.Between(0, 9) < 1) {
          this.createSpikes(
            lastX - block.displayWidth,
            y - block.displayHeight,
            3
          );
        }
      }
    }
  }

  public createSpikes(x: number, y: number, count: number): void {
    const spike = this.spikes.create(x + 0 * (64 * CONFIG.scale), y, "spike");
    // const img = this.spike
    spike.setOrigin(0, 1);
    spike.setScale(CONFIG.scale);
    spike.refreshBody();
  }
  private hitSpike(
    hero: Physics.Arcade.Sprite,
    spike: Physics.Arcade.Sprite
  ): void {
    hero.setTint(0xff0000);
    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        hero.clearTint();
      },
      callbackScope: this,
    });

    this.scene.heroManager.hit();
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
      this.scene.heroManager.hit();
    }
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
          lastPlatform.y + newYDirection * PhaserMath.Between(20, 50);
        const platformLength = PhaserMath.Between(3, 5);

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
