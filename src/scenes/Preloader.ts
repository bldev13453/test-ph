import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    const { width, height } = this.scale;

    this.add
      .image(width / 2, height / 2, "background")
      .setDisplaySize(width, height)
      .setOrigin(0.5, 0.5);

    //  A simple progress bar. This is the outline of the bar.
    const barWidth = width * 0.6; // 60% of the screen width
    const barHeight = 32;

    this.add
      .rectangle(width / 2, height / 2, barWidth, barHeight)
      .setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add
      .rectangle(
        (width - barWidth) / 2 + 3,
        height / 2,
        4,
        barHeight - 4,
        0xffffff
      )
      .setOrigin(0, 0.5);

    this.load.on("progress", (progress: number) => {
      //  Update the progress bar
      bar.width = (barWidth - 6) * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
  }
}
