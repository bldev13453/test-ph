import { Physics } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";
import { EVENTS } from "./events";

export class HeroManager {
  private hero: Physics.Arcade.Sprite;
  private hp: number;
  public shieldBoosterActive = false;
  public jumpBoosterActive = false;
  public magnetBoosterActive = false;
  private jumpTwice = false;
  constructor(private scene: Game) {
    this.hero = this.scene.physics.add
      .sprite(
        CONFIG.startPosition.x,
        this.scene.scale.height - CONFIG.startPosition.y,
        "hero-walk-sprite"
      )
      .setOffset(0, -40)
      .setScale(0.21)
      .setGravityY(CONFIG.gravityY)
      .setDepth(2);

    this.initAnimations();

    this.scene.cameras.main.startFollow(
      this.hero,
      undefined,
      undefined,
      0.02,
      -this.scene.scale.width / 5,
      this.scene.scale.height / 7
    );

    this.hp = this.livesCount;
    this.scene.eventBus.on(EVENTS.HIT, () => {
      this.setHp(this.hp - 1);
      this.scene.appState.setGameProp("hpAmount", this.hp);
      this.scene.restartScene();
    });
    this.scene.eventBus.on(EVENTS.FALL, () => {
      this.setHp(this.hp - 1);
      this.scene.appState.setGameProp("hpAmount", this.hp);
      this.scene.restartScene();
    });
    this.scene.eventBus.on(EVENTS.COLLECT_PEPE, () => {
      this.shieldBoosterActive = true;

      this.scene.time.addEvent({
        delay: this.shieldDuration * 1000,
        callback: () => {
          this.shieldBoosterActive = false;
        },
        callbackScope: this,
      });
    });
    this.scene.eventBus.on(EVENTS.COLLECT_DOGE, () => {
      this.jumpBoosterActive = true;
      this.scene.time.addEvent({
        delay: this.jumpDuration * 1000,
        callback: () => {
          this.jumpBoosterActive = false;
        },
        callbackScope: this,
      });
    });
    this.scene.eventBus.on(EVENTS.COLLECT_MEW, () => {
      this.magnetBoosterActive = true;
      this.scene.time.addEvent({
        delay: this.magnetDuration * 1000,
        callback: () => {
          this.magnetBoosterActive = false;
        },
        callbackScope: this,
      });
    });
  }

  public update(): void {
    this.handleInput();
  }

  // public destroy(): void {
  //   this.scene.eventBus.
  // }

  private handleInput() {
    this.scene.eventBus.emit(EVENTS.HERO_RUN, this.hero.x, this.hero.y);
  }

  private get livesCount(): number {
    return this.scene.appState.getGameProp("hpAmount") || 3;
  }

  private get shieldLevel(): number {
    return this.scene.appState.getGameProp("pepeLevel") || 1;
  }
  private get shieldDuration(): number {
    return this.shieldLevel * 5; // seconds
  }
  private get jumpLevel(): number {
    return this.scene.appState.getGameProp("dogeLevel") || 1;
  }
  private get jumpDuration(): number {
    return this.jumpLevel * 5;
  }
  private get magnetLevel(): number {
    return this.scene.appState.getGameProp("mewLevel") || 1;
  }
  private get magnetDuration(): number {
    return this.magnetLevel * 5;
  }
  resetPosition(): void {
    this.hero.setPosition(
      CONFIG.startPosition.x,
      this.scene.scale.height - CONFIG.startPosition.y
    );
    this.hero.setVelocityX(0);
    this.hero.anims.play("walk");
    this.hero.setFrame(0);
  }
  private initAnimations(): void {
    // Animation for walking
    if (!this.scene.anims.exists("walk")) {
      this.scene.anims.create({
        key: "walk",
        frames: this.scene.anims.generateFrameNumbers("hero-walk-sprite", {
          start: 0,
          end: 4,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Animation for jumping
    if (!this.scene.anims.exists("jump")) {
      this.scene.anims.create({
        key: "jump",
        frames: this.scene.anims.generateFrameNumbers("hero-jump-sprite", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  public start(): void {
    this.hero.anims.play("walk");
    this.hero.setVelocityX(CONFIG.heroSpeed);
  }

  public jump(): void {
    if (this.hero.body?.touching.down) {
      this.scene.sound.play("jump");
      this.hero.setVelocityY(-CONFIG.jumpPower);
    }
    if (
      this.jumpBoosterActive &&
      !this.hero.body?.touching.down &&
      !this.jumpTwice
    ) {
      this.scene.sound.play("jump");
      this.hero.setVelocityY(-CONFIG.jumpPower);
      this.jumpTwice = true;
    }
  }

  public updateAnimations(): void {
    const deltaY = this.hero.body?.deltaY() || 0;
    const isGettingUp = deltaY < -0.2;
    const isGettingDown = deltaY > 0.2;
    const isJumping = isGettingUp || isGettingDown;

    if (isJumping) {
      if (this.hero.anims.currentAnim?.key !== "jump") {
        this.hero.anims.play("jump");
      }
      if (isGettingUp) {
        this.hero.setTexture("hero-jump-sprite", 1);
      }
      if (isGettingDown) {
        this.hero.setTexture("hero-jump-sprite", 2);
      }
    } else if (this.hero.anims.currentAnim?.key !== "walk") {
      this.hero.setTexture("hero-walk-sprite", 1);
      this.hero.anims.play("walk");
    }
    if (this.hero.body?.touching.down) {
      this.jumpTwice = false;
    }
  }
  hit() {
    this.setHp(this.currentHp - 1);
  }
  private setHp = (hp: number): void => {
    if (hp === 0) {
      this.hp = 3;
    } else {
      this.hp = hp;
    }
  };

  get currentHp(): number {
    return this.hp;
  }

  public get sprite(): Physics.Arcade.Sprite {
    return this.hero;
  }
}
