import { Scene, Physics, GameObjects, Math as PhaserMath } from "phaser";

const CONFIG = {
  startPosition: { x: 50, y: 300 },
  playerSpeed: 180,
  gravityY: 500,
  jumpPower: 300,
  scale: 0.15, // Масштаб всех спрайтов в игре
  platformSizeTexture: 256,
  startGenerateItemsCoordinateX: 300,
};

export class Game extends Scene {
  private player!: Physics.Arcade.Sprite;
  private platforms!: Physics.Arcade.StaticGroup;
  private platformGroup!: GameObjects.Group;
  private spikes!: Physics.Arcade.StaticGroup;
  private positionText!: GameObjects.Text;
  private hearts!: GameObjects.Group;

  constructor() {
    super("Game");
  }

  create(): void {
    const { height } = this.scale;
    this.player = this.physics.add.sprite(
      CONFIG.startPosition.x,
      height - CONFIG.startPosition.y,
      "character_sprite"
    );
    this.player.setOffset(0, -70);
    this.player.setScale(0.25);
    this.player.setGravityY(CONFIG.gravityY);
    this.player.setVelocityX(CONFIG.playerSpeed);
    this.player.setDepth(10);

    // Анимация движения персонажа
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("character_sprite", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.player.anims.play("walk");

    // Платформы
    this.platforms = this.physics.add.staticGroup();
    this.platformGroup = this.add.group({
      removeCallback: (platform: GameObjects.GameObject) => {
        this.platforms.killAndHide(platform);
      },
    });
    this.spikes = this.physics.add.staticGroup();

    // Инициализация первой платформы
    this.createPlatform(0, height - 50, 10); // Уточнена позиция платформы

    // Коллизии
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.platformGroup);

    // Использование overlap вместо collider для шипов
    this.physics.add.overlap(
      this.player,
      this.spikes,
      this.hitSpike as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Камера
    this.cameras.main.startFollow(this.player);

    // Создание новых платформ
    this.time.addEvent({
      delay: 500,
      callback: this.createMorePlatforms,
      callbackScope: this,
      loop: true,
    });

    // Текст позиции игрока
    this.positionText = this.add.text(10, 50, "X: 0", {
      font: "16px Arial",
      // fill: "#000000",
    });

    this.hearts = this.add.group({
      key: "heart",
      repeat: 2,
      setXY: { x: 30, y: 30, stepX: 20 },
    });
    this.hearts.getChildren().forEach((heart: GameObjects.GameObject) => {
      (heart as GameObjects.Image).setScrollFactor(0).setScale(0.3);
    });
  }

  update(): void {
    this.platformGroup
      .getChildren()
      .forEach((platform: GameObjects.GameObject) => {
        if (
          (platform as GameObjects.Image).x <
          this.cameras.main.scrollX -
            (platform as GameObjects.Image).displayWidth
        ) {
          this.platformGroup.killAndHide(platform);
          this.platformGroup.remove(platform);
        }
      });

    if (this.input.activePointer.isDown) {
      this.jump();
    }

    this.positionText.setText(`X: ${Math.floor(this.player.x)}`);
    this.positionText.setScrollFactor(0);

    // get Y position for the last platform
    const lastPlatform = this.platformGroup.getLast(true);
    const lastPlatformY = lastPlatform
      ? (lastPlatform as GameObjects.Image).y
      : 0;
    if (this.player.y > lastPlatformY + 500) {
      this.scene.start("GameOver");
    }
  }

  jump(): void {
    if (this.player.body?.touching.down) {
      this.player.setVelocityY(-CONFIG.jumpPower);
    }
  }

  createPlatform(x: number, y: number, platformLength = 3): void {
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
      this.platformGroup.add(block); // Добавляем блок в группу
      block.setDepth(1);
      lastX += block.displayWidth;
      console.log(this.player.x, CONFIG.startGenerateItemsCoordinateX);
      if (this.player.x > CONFIG.startGenerateItemsCoordinateX) {
        if (PhaserMath.Between(0, 1) === 1) {
          // 50% вероятность
          const coin = this.physics.add.sprite(
            lastX - block.displayWidth / 2,
            y - 50,
            "coin"
          );
          coin.setScale(0.3);
          this.physics.add.overlap(
            this.player,
            coin,
            this
              .collectCoin as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
            undefined,
            this
          );
        } else if (PhaserMath.Between(0, 9) < 1) {
          // 20% вероятность появления шипов
          this.createSpikes(
            lastX - block.displayWidth,
            y - block.displayHeight,
            3
          ); // Высота шипов относительно платформы
        }
      }
    }
  }

  createSpikes(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const spike = this.spikes.create(x + i * (64 * CONFIG.scale), y, "spike");
      spike.setOrigin(0, 1);
      spike.setScale(CONFIG.scale);
      spike.refreshBody();
    }
  }

  hitSpike(player: Physics.Arcade.Sprite, spike: Physics.Arcade.Sprite): void {
    this.player.setTint(0xff0000);
    this.time.addEvent({
      delay: 200,
      callback: () => {
        this.player.clearTint();
      },
      callbackScope: this,
    });

    // Уменьшаем количество сердец
    const heart = this.hearts.getFirstAlive() as GameObjects.Image;
    if (heart) {
      this.tweens.add({
        targets: heart,
        y: heart.y - 50,
        alpha: 0,
        ease: "Power1",
        duration: 300,
        onComplete: () => {
          heart.destroy();
        },
      });
    }
  }

  createMorePlatforms(): void {
    const { width } = this.scale;
    const lastPlatform = this.platformGroup.getLast(true) as GameObjects.Image;

    if (lastPlatform && lastPlatform.x < this.cameras.main.scrollX + width) {
      const platformsCount = PhaserMath.Between(1, 3); // Генерируем от 1 до 3 платформ
      let previousX = lastPlatform.x + lastPlatform.displayWidth;

      for (let i = 0; i < platformsCount; i++) {
        const gap = PhaserMath.Between(
          CONFIG.platformSizeTexture * CONFIG.scale,
          CONFIG.platformSizeTexture * CONFIG.scale * 3
        );
        const newX = previousX + gap; // Вычисляем начальную координату X новой платформы
        const newYDirection = PhaserMath.Between(0, 1) === 0 ? -1 : 1; // Направление по Y: вверх или вниз
        const newY =
          lastPlatform.y + newYDirection * PhaserMath.Between(20, 50); // Вычисляем новую координату Y
        const platformLength = PhaserMath.Between(3, 5); // Длина платформы

        this.createPlatform(newX, newY, platformLength);
        previousX =
          newX +
          (this.platforms.getChildren()[0] as GameObjects.Image).displayWidth *
            platformLength; // Обновляем последнюю позицию X для следующей платформы
      }
    }
  }

  collectCoin(
    player: Physics.Arcade.Sprite,
    coin: Physics.Arcade.Sprite
  ): void {
    this.sound.play("coin");
    coin.disableBody(true, false);
    this.tweens.add({
      targets: coin,
      y: coin.y - 100,
      alpha: 0,
      ease: "Power1",
      duration: 800,
      onComplete: () => {
        coin.destroy();
      },
    });
  }
}
