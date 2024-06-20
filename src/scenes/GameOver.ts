import { Scene } from "phaser";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0xff0000);

    const bg = this.add
      .image(width / 2, height / 2, "background")
      .setAlpha(0.5);
    const bgScale = Math.max(width / bg.width, height / bg.height);
    bg.setScale(bgScale);

    const text = this.add
      .text(width / 2, height / 2, "Game Over", {
        fontFamily: "Arial Black",
        fontSize: Math.round(height * 0.05),
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: Math.round(height * 0.01),
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
