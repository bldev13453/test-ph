import { Physics, GameObjects } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";
import { EVENTS } from "./events";

export class HeroManager {
  private hero: Physics.Arcade.Sprite;
  private shield: GameObjects.Sprite;
  private container: GameObjects.Container; // Container for hero and shield
  private hp: number;
  public shieldBoosterActive = false;
  public jumpBoosterActive = false;
  public magnetBoosterActive = false;
  private jumpTwice = false;

  constructor(private scene: Game) {
    // Create hero sprite
    this.hero = this.scene.physics.add
      .sprite(0, 0, "hero-walk-sprite")
      .setOffset(0, 0)
      .setScale(0.21);

    // Create shield sprite but initially invisible
    this.shield = this.scene.add
      .sprite(0, 0, "bubble-shield")
      .setScale(0.25)
      .setVisible(false);

    // Create container and add hero and shield to it
    this.container = this.scene.add.container(
      CONFIG.startPosition.x,
      this.scene.scale.height - CONFIG.startPosition.y,
      [this.hero, this.shield]
    );
    this.scene.physics.world.enable(this.container); // Enable physics for the container

    // Adjust physics body to match hero sprite
    const body = this.container.body as Physics.Arcade.Body;
    body.setSize(
      this.hero.width * this.hero.scaleX,
      this.hero.height * this.hero.scaleY
    );
    body.setOffset(0, -35);
    body.setGravityY(CONFIG.gravityY);

    // Set depth
    this.container.setDepth(2);

    this.initAnimations();

    this.scene.cameras.main.startFollow(
      this.container,
      undefined,
      undefined,
      0.02,
      -this.scene.scale.width / 5,
      this.scene.scale.height / 7
    );

    this.hp = this.livesCount;
    this.scene.eventBus.on(EVENTS.HIT, this.handleHit, this);
    this.scene.eventBus.on(EVENTS.FALL, this.handleFall, this);
    this.scene.eventBus.on(EVENTS.COLLECT_PEPE, this.activateShield, this);
    this.scene.eventBus.on(EVENTS.COLLECT_DOGE, this.activateJumpBooster, this);
    this.scene.eventBus.on(
      EVENTS.COLLECT_MEW,
      this.activateMagnetBooster,
      this
    );
  }

  private handleHit(): void {
    this.setHp(this.hp - 1);
    this.scene.appState.setGameProp("hpAmount", this.hp);
    this.scene.restartScene();
  }

  private handleFall(): void {
    this.setHp(this.hp - 1);
    this.scene.appState.setGameProp("hpAmount", this.hp);
    this.scene.restartScene();
  }

  private activateShield(): void {
    this.shieldBoosterActive = true;
    this.shield.setVisible(true);

    this.scene.time.addEvent({
      delay: this.scene.appState.getShieldDuration() * 1000,
      callback: () => {
        this.shieldBoosterActive = false;
        this.shield.setVisible(false);
      },
      callbackScope: this,
    });
  }

  private activateJumpBooster(): void {
    this.jumpBoosterActive = true;
    this.scene.time.addEvent({
      delay: this.scene.appState.getJumpDuration() * 1000,
      callback: () => {
        this.jumpBoosterActive = false;
      },
      callbackScope: this,
    });
  }

  private activateMagnetBooster(): void {
    this.magnetBoosterActive = true;
    this.scene.time.addEvent({
      delay: this.magnetDuration * 1000,
      callback: () => {
        this.magnetBoosterActive = false;
      },
      callbackScope: this,
    });
  }

  public update(): void {
    this.handleInput();

    // Ensure the shield and hero are properly positioned in the container
    this.shield.setPosition(this.hero.x, this.hero.y);
  }

  private handleInput() {
    this.scene.eventBus.emit(
      EVENTS.HERO_RUN,
      this.container.x,
      this.container.y
    );
  }

  private get livesCount(): number {
    return this.scene.appState.getGameProp("hpAmount") || 3;
  }

  private get magnetLevel(): number {
    return this.scene.appState.getGameProp("mewLevel") || 1;
  }
  private get magnetDuration(): number {
    return this.magnetLevel * 5;
  }

  resetPosition(): void {
    this.container.setPosition(
      CONFIG.startPosition.x,
      this.scene.scale.height - CONFIG.startPosition.y
    );
    const body = this.container.body as Physics.Arcade.Body;
    body.setVelocityX(0);
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
    const body = this.container.body as Physics.Arcade.Body;
    this.hero.anims.play("walk");
    body.setVelocityX(CONFIG.heroSpeed);
  }

  public jump(): void {
    const body = this.container.body as Physics.Arcade.Body;
    if (body.touching.down) {
      this.scene.sound.play("jump");
      body.setVelocityY(-CONFIG.jumpPower);
    }
    if (this.jumpBoosterActive && !body.touching.down && !this.jumpTwice) {
      this.scene.sound.play("jump");
      body.setVelocityY(-CONFIG.jumpPower);
      this.jumpTwice = true;
    }
  }

  public updateAnimations(): void {
    const body = this.container.body as Physics.Arcade.Body;
    const deltaY = body.deltaY() || 0;
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
    if (body.touching.down) {
      this.jumpTwice = false;
    }
  }

  private setHp(hp: number): void {
    if (hp === 0) {
      this.hp = 3;
    } else {
      this.hp = hp;
    }
  }

  get currentHp(): number {
    return this.hp;
  }

  public get heroContainerSprite(): Physics.Arcade.Body {
    return this.container.body as Physics.Arcade.Body;
  }
  public get sprite(): Physics.Arcade.Sprite {
    return this.hero;
  }
}
