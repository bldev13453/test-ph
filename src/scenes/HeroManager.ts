import { Physics } from "phaser";
import { CONFIG } from "./config";
import { Game } from "./Game";

export class HeroManager {
  private hero: Physics.Arcade.Sprite;
  private hp: number;
  constructor(private scene: Game) {
    this.hero = this.scene.physics.add.sprite(
      CONFIG.startPosition.x,
      this.scene.scale.height - CONFIG.startPosition.y,
      "character_walk_sprite"
    );
    this.hero.setOffset(0, -40);
    this.hero.setScale(0.23);
    this.hero.setGravityY(CONFIG.gravityY);
    this.hero.setDepth(10);

    this.initAnimations();
    this.scene.cameras.main.startFollow(
      this.hero,
      undefined,
      undefined,
      undefined,
      undefined,
      this.scene.scale.height / 5
    );

    this.hp = this.scene.registry.get("hp") || 3;
    this.scene.hudManager.setHpIcons(this.hp);
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
        frames: this.scene.anims.generateFrameNumbers("character_walk_sprite", {
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
        frames: this.scene.anims.generateFrameNumbers("character_jump_sprite", {
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
      this.hero.setVelocityY(-CONFIG.jumpPower);
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
        this.hero.setTexture("character_jump_sprite", 1);
      }
      if (isGettingDown) {
        this.hero.setTexture("character_jump_sprite", 2);
      }
    } else if (this.hero.anims.currentAnim?.key !== "walk") {
      this.hero.setTexture("character_walk_sprite", 1);
      this.hero.anims.play("walk");
    }
  }
  hit() {
    this.setHp(this.currentHp - 1);
    this.scene.restartScene();
  }
  private setHp = (hp: number): void => {
    if (this.hp > hp) {
      this.scene.hudManager.decreaseHearts();
    }
    if (hp === 0) {
      this.hp = 3;
    } else {
      this.hp = hp;
    }
    this.scene.registry.set("hp", this.hp);
  };

  get currentHp(): number {
    return this.hp;
  }

  public get sprite(): Physics.Arcade.Sprite {
    return this.hero;
  }
}
