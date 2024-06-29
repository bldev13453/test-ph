import { Physics, GameObjects, Math as PhaserMath, Types } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";
import { EVENTS } from "./events";

export class PlatformManager {
  private platformColumns: PlatformColumn[] = [];

  constructor(private scene: Game) {
    const { height, width } = this.scene.scale;

    const initialColumn = new PlatformColumn(
      this.scene,
      -width,
      height - 10,
      1,
      true
    );
    this.platformColumns.push(initialColumn);

    this.scene.physics.add.collider(
      this.scene.heroManager.sprite,
      initialColumn.getGroup()
    );

    this.initAnimations();
  }

  private initAnimations(): void {
    // Animation for doge
    if (!this.scene.anims.exists("doge")) {
      this.scene.anims.create({
        key: "doge",
        frames: this.scene.anims.generateFrameNumbers("doge-sprite", {
          start: 0,
          end: 1,
        }),
        frameRate: 3,
        repeat: -1,
      });
    }

    // Animation for pepe
    if (!this.scene.anims.exists("pepe")) {
      this.scene.anims.create({
        key: "pepe",
        frames: this.scene.anims.generateFrameNumbers("pepe-sprite", {
          start: 0,
          end: 1,
        }),
        frameRate: 2,
        repeat: -1,
      });
    }
  }

  public createMorePlatforms(): void {
    const { width } = this.scene.scale;
    const lastColumn = this.platformColumns[this.platformColumns.length - 1];
    const lastPlatformGroup = lastColumn.getGroup();
    const groupMaxX = Math.max(
      ...lastPlatformGroup
        .getChildren()
        .map((item) => (item as GameObjects.Image).x)
    );

    const lastPlatform = lastPlatformGroup.getLast(true) as GameObjects.Image;
    const isFirstColumn = this.platformColumns.length === 1;
    if (
      lastPlatform &&
      groupMaxX < this.scene.cameras.main.scrollX + width + 300
    ) {
      const patterns = [1, 2, 3, 4, 5];
      const selectedPattern =
        patterns[PhaserMath.Between(0, patterns.length - 1)];

      const columnGap = 40;
      const newX = groupMaxX + lastPlatform.displayWidth + columnGap;

      const newY = isFirstColumn
        ? lastPlatform.y + 60
        : lastPlatform.y - PhaserMath.Between(-20, 20);

      const newColumn = new PlatformColumn(
        this.scene,
        newX,
        newY,
        selectedPattern
      );
      this.platformColumns.push(newColumn);

      const newColumnMinY = newColumn.minY;

      if (Math.abs(newColumnMinY - newY) > 50) {
        const selectedPattern =
          patterns[PhaserMath.Between(0, patterns.length - 1)];
        const lowerColumn = new PlatformColumn(
          this.scene,
          newColumn.maxX + columnGap + 20,
          newY + 10,
          selectedPattern
        );
        this.platformColumns.push(lowerColumn);
      }
    }
  }

  public update(): void {
    const lastPlatform = this.platformColumns[this.platformColumns.length - 1]
      .getGroup()
      .getLast(true) as GameObjects.Image;

    const lastPlatformY = lastPlatform ? lastPlatform.y : 0;
    if (this.scene.heroManager.sprite.y > Math.abs(lastPlatformY) + 1000) {
      this.handleFall();
    }
  }

  private resetPlatforms(): void {
    this.platformColumns.forEach((column) => {
      column.removeColumn();
    });

    this.platformColumns = [];
  }

  private handleFall(): void {
    this.resetPlatforms();
    this.scene.eventBus.emit(EVENTS.FALL);
  }

  public startGeneratePlatforms(): void {
    this.scene.time.addEvent({
      delay: 500,
      callback: this.createMorePlatforms,
      callbackScope: this,
      loop: true,
    });
  }
}

export class PlatformColumn {
  private platforms: Physics.Arcade.StaticGroup;
  private bushes: Physics.Arcade.StaticGroup;
  private platformGroup: GameObjects.Group;
  private isHeroDamaged = false;

  constructor(
    private scene: Game,
    private x: number,
    private y: number,
    private count: number,
    private isInit?: boolean
  ) {
    this.platforms = this.scene.physics.add.staticGroup();
    this.bushes = this.scene.physics.add.staticGroup();
    this.platformGroup = this.scene.add.group();

    this.createColumn(isInit);
    this.scene.physics.add.overlap(
      this.scene.heroManager.sprite,
      this.bushes,
      this.hitBush as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.scene.physics.add.collider(
      this.scene.heroManager.sprite,
      this.platformGroup,
      (obj1, obj2) => {
        if (this.isInit) {
          this.handleStartGroundCollide(
            obj1 as Physics.Arcade.Sprite,
            obj2 as Physics.Arcade.Sprite
          );
        }
      }
    );
  }

  private handleStartGroundCollide(
    hero: Physics.Arcade.Sprite,
    platform: Physics.Arcade.Sprite
  ): void {
    // Define the threshold for being "close to the end" of the platform
    const closeThreshold = 1500;

    // Get the positions
    const heroX = hero.x;

    const platformEndX = platform.width;

    // Check if the hero is within the threshold of the end of the platform
    if (platformEndX - heroX <= closeThreshold) {
      // Start generating more platforms
      this.scene.platformManager.startGeneratePlatforms();
    }
  }

  private createColumn(isInit: boolean = false): void {
    const counter = isInit ? 1 : this.count;
    const xPos = isInit ? -70 : this.x + PhaserMath.Between(0, 50);
    let lastY = this.y;
    for (let i = 0; i < counter; i++) {
      const platformLength = PhaserMath.Between(3, 10);
      this.createPlatform(xPos, lastY, platformLength);
      lastY -= 80;
    }
  }

  private createPlatform(x: number, y: number, platformLength: number): void {
    let lastX = x;

    for (let i = 0; i < platformLength; i++) {
      const texture = this.isInit ? "menu-ground" : "platform";
      const block = this.platforms.create(lastX, y, texture);

      const origin = this.isInit ? [0, 0] : [0, 1];
      block.setOrigin(...origin);
      block.setDepth(1);
      block.setScale(this.isInit ? 0.4 : CONFIG.scale);
      block.refreshBody();
      block.body.checkCollision.up = true;
      block.body.checkCollision.down = false;
      block.body.checkCollision.left = false;
      block.body.checkCollision.right = false;
      this.platformGroup.add(block);
      lastX += block.displayWidth;

      if (this.isInit) break;

      if (i > 3 && platformLength > 3 && PhaserMath.Between(0, 8) === 1) {
        this.createBushes(lastX - block.displayWidth, y - block.displayHeight);
      } else if (PhaserMath.Between(0, 1) === 1) {
        this.scene.coinsManager.createCoin(
          lastX - block.displayWidth / 2,
          y - 50
        );
      } else if (PhaserMath.Between(0, 10) === 1) {
        this.createNpc(lastX - block.displayWidth, y - 70);
      }
    }
  }

  private collectNpc(
    hero: GameObjects.Sprite,
    npc: Physics.Arcade.Sprite,
    name: "pepe" | "doge"
  ): void {
    // this.scene.sound?.play("coin");
    npc.disableBody(true, false);

    this.scene.tweens.add({
      targets: npc,
      y: npc.y - 100,
      alpha: 0,
      ease: "Power1",
      duration: 800,
      onComplete: () => {
        npc.destroy();
      },
    });
    const eventName =
      name === "pepe" ? EVENTS.COLLECT_PEPE : EVENTS.COLLECT_DOGE;
    this.scene.eventBus.emit(eventName);
  }
  private createNpc(x: number, y: number) {
    if (PhaserMath.Between(1, 2) === 1) {
      this.createDoge(x, y);
    } else {
      this.createPepe(x, y);
    }
  }

  private createPepe(x: number, y: number) {
    const pepe = this.scene.physics.add
      .sprite(x, y + 10, "pepe-sprite")
      .setScale(0.12)
      .setDepth(2);

    this.addNpcOverlap(pepe, "pepe");
    pepe.anims.play("pepe");
  }

  private createDoge(x: number, y: number) {
    const doge = this.scene.physics.add
      .sprite(x, y + 10, "doge-sprite")
      .setScale(0.12)
      .setDepth(2);
    this.addNpcOverlap(doge, "doge");
    doge.anims.play("doge");
  }

  private addNpcOverlap(
    npc: Physics.Arcade.Sprite,
    name: "pepe" | "doge"
  ): void {
    this.scene.physics.add.overlap(
      this.scene.heroManager.sprite,
      npc,
      (hero, npc) =>
        this.collectNpc(
          hero as Physics.Arcade.Sprite,
          npc as Physics.Arcade.Sprite,
          name
        ),
      undefined,
      this.scene
    );
  }

  private createBushes(x: number, y: number): void {
    this.bushes
      .create(x + 64 * CONFIG.scale, y, "bush")
      .setDepth(2)
      .setScale(0.1)
      .refreshBody();
  }

  private hitBush(
    hero: Physics.Arcade.Sprite,
    bush: Physics.Arcade.Sprite
  ): void {
    if (this.scene.heroManager.shieldBoosterActive) return;
    if (this.isHeroDamaged) return;

    this.isHeroDamaged = true;
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

  public removeColumn(): void {
    this.platformGroup.clear(true, true);
  }

  public getGroup(): GameObjects.Group {
    return this.platformGroup;
  }
  public get minY(): number {
    return Math.min(
      ...this.platforms
        .getChildren()
        .map((item) => (item as GameObjects.Image).y)
    );
  }
  public get maxX(): number {
    return Math.max(
      ...this.platforms
        .getChildren()
        .map((item) => (item as GameObjects.Image).x)
    );
  }
}
