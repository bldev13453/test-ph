import { GameObjects, Scene } from "phaser";
import { IAppState } from "./State";

type BoostsScreen = "game" | "meme";

export class Boosts extends Scene {
  private backButton: GameObjects.Image;
  private gameBoostsButton: GameObjects.Image;
  private memeBoostsButton: GameObjects.Image;
  private boostsButtonsContainer: GameObjects.Container;
  private activeScreen: BoostsScreen = "game";
  private coin: GameObjects.Image;
  private count: GameObjects.Text;
  private gameBoosts = [
    {
      name: "HP",
      icon: "heart",
      price: 1,
    },
    {
      name: "HP",
      icon: "heart",
      price: 1,
    },
    {
      name: "HP",
      icon: "heart",
      price: 1,
    },
    {
      name: "HP",
      icon: "heart",
      price: 1,
    },
  ];
  private memeBoosts = [
    {
      name: "Shield",
      icon: "heart",
      price: 1,
    },
    {
      name: "Jump",
      icon: "heart",
      price: 1,
    },
  ];

  currentBoosts = this.gameBoosts;

  private cardsContainer: GameObjects.Container;
  constructor(private readonly appState: IAppState) {
    super("Boosts");
  }

  create() {
    this.setBackground();
    this.createBackButton();
    this.createBoostsButtons();
    this.createCards();
    this.displayCoins();
  }

  update() {}

  private get coinsCount(): number {
    return this.appState.getProp("coins");
  }

  private setBackground() {
    const { width, height } = this.scale;
    this.add.graphics().fillStyle(0x65aadf, 1).fillRect(0, 0, width, height);

    this.add
      .text(width / 2, 30, "BOOST SHOP", {
        fontSize: "28px",
        color: "#000",
        fontStyle: "normal",
        fontFamily: '"Press Start 2P"',
      })
      .setOrigin(0.5, 0.5);
  }

  private createBackButton(): void {
    this.backButton = this.add
      .image(60, this.cameras.main.height - 30, "back-button")
      .setScale(0.12)
      .setDepth(5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop().launch("Game").launch("HUD");
      });
  }

  private createBoostsButtons(): void {
    const { width } = this.scale;

    this.boostsButtonsContainer = this.add.container(width / 2, 100);
    this.gameBoostsButton = this.add
      .image(0, 0, "game-boosts-button-hover")
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        this.setActiveScreen("game");
      });
    this.gameBoostsButton.x = -this.gameBoostsButton.displayWidth / 2 - 10;
    this.memeBoostsButton = this.add
      .image(0, 0, "meme-boosts-button")
      .setScale(0.2)
      .setInteractive()
      .on("pointerdown", () => {
        this.setActiveScreen("meme");
      });
    this.memeBoostsButton.x = +this.memeBoostsButton.displayWidth / 2 + 10;

    this.boostsButtonsContainer
      .add(this.gameBoostsButton)
      .add(this.memeBoostsButton);
  }

  private updateBoostsButtons(screen: BoostsScreen): void {
    if (screen === "game") {
      this.gameBoostsButton.setTexture("game-boosts-button-hover");
      this.memeBoostsButton.setTexture("meme-boosts-button");
    } else {
      this.gameBoostsButton.setTexture("game-boosts-button");
      this.memeBoostsButton.setTexture("meme-boosts-button-hover");
    }
  }

  private setActiveScreen(screen: BoostsScreen): void {
    this.activeScreen = screen;
    this.updateBoostsButtons(this.activeScreen);
    this.currentBoosts = screen === "game" ? this.gameBoosts : this.memeBoosts;
    this.createCards();
  }

  private createCards() {
    if (this.cardsContainer) {
      this.cardsContainer.destroy();
    }
    this.cardsContainer = this.add.container(0, 0);
    // Grid configuration
    // Calculate rows and cols depend on the number of current boosts
    const rows = Math.ceil(this.currentBoosts.length / 2);
    const cols = 2;

    const spacingX = 20;
    const spacingY = 20;

    const cardWidth = (this.cameras.main.width - (cols + 1) * spacingX) / cols;
    const cardHeight = cardWidth * 1.25; // Adjusted height to make cards smaller

    // Calculate starting positions to center the grid
    const startX =
      (this.cameras.main.width - (cols * (cardWidth + spacingX) - spacingX)) /
      2;
    const startY = 150; // Start below the `boostsButtonsContainer`

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (cardWidth + spacingX);
        const y = startY + row * (cardHeight + spacingY);

        // Draw the card
        const card = this.add.graphics();
        card.fillStyle(0xffffff, 1);
        card.fillRoundedRect(x, y, cardWidth, cardHeight, 20);
        card.lineStyle(2, 0x000000, 1);
        card.strokeRoundedRect(x, y, cardWidth, cardHeight, 20);

        // Add top rectangle
        card.fillStyle(0x87ceeb, 1);
        card.fillRoundedRect(x + 10, y + 10, cardWidth - 20, 50, 10);
        card.lineStyle(2, 0x000000, 1);
        card.strokeRoundedRect(x + 10, y + 10, cardWidth - 20, 50, 10);

        // Add booster name to the top rectangle
        const name = this.add
          .text(
            x + cardWidth / 2,
            y + 35,
            this.currentBoosts[row * 2 + col].name,
            {
              fontSize: "20px",
              color: "#000",
              fontFamily: '"Press Start 2P"',
            }
          )
          .setOrigin(0.5);

        // Add heart icon in the middle of the card
        const heart = this.add
          .image(x + cardWidth / 2, y + cardHeight / 2, "heart")
          .setScale(0.45);
        heart.setOrigin(0.5);

        // Adding bottom rectangle
        card.fillStyle(0x87ceeb, 1);
        card.fillRoundedRect(
          x + 10,
          y + cardHeight - 60,
          cardWidth - 20,
          50,
          10
        );
        card.lineStyle(2, 0x000000, 1);
        card.strokeRoundedRect(
          x + 10,
          y + cardHeight - 60,
          cardWidth - 20,
          50,
          10
        );

        // Add coin icon and price
        const priceText = "1"; // Replace with the actual price
        const priceStyle = { fontSize: "24px", color: "#000" };
        const price = this.add.text(0, 0, priceText, priceStyle);

        // Calculate the total width of the coin icon and price text
        const coin = this.add.image(0, 0, "coin").setScale(0.5);
        const coinWidth = coin.displayWidth;
        const priceWidth = price.width;
        const totalWidth = coinWidth + priceWidth + 10; // 10px padding between coin and price

        // Set positions to center them at the bottom of the card
        coin.setPosition(
          x + cardWidth / 2 - totalWidth / 2 + coinWidth / 2,
          y + cardHeight - 35
        );
        price.setPosition(
          x + cardWidth / 2 - totalWidth / 2 + coinWidth + 10,
          y + cardHeight - 45
        );
        // Add an invisible interactive rectangle for the lower section
        const lowerSection = this.add.rectangle(
          x + cardWidth / 2,
          y + cardHeight - 35,
          cardWidth - 20,
          50,
          0x000000,
          0
        );
        lowerSection
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => {
            this.payForBoost("boosts");
          })
          .on("pointerover", () => {
            card.fillStyle(0xff69b4, 0.7); // Change to pink with 30% opacity on hover
            card.fillRoundedRect(
              x + 10,
              y + cardHeight - 60,
              cardWidth - 20,
              50,
              10
            );
            card.lineStyle(2, 0x000000, 1);
            card.strokeRoundedRect(
              x + 10,
              y + cardHeight - 60,
              cardWidth - 20,
              50,
              10
            );
          })
          .on("pointerout", () => {
            card.fillStyle(0x87ceeb, 1);
            card.fillRoundedRect(
              x + 10,
              y + cardHeight - 60,
              cardWidth - 20,
              50,
              10
            );
            card.lineStyle(2, 0x000000, 1);
            card.strokeRoundedRect(
              x + 10,
              y + cardHeight - 60,
              cardWidth - 20,
              50,
              10
            );
          });
        this.cardsContainer.add(card);
        this.cardsContainer.add(heart);
        this.cardsContainer.add(lowerSection);
        this.cardsContainer.add(price);
        this.cardsContainer.add(coin);
        this.cardsContainer.add(price);
        this.cardsContainer.add(name);
      }
    }
  }

  private recalculateCoinPosition(): void {
    const { height, width } = this.scale;
    const coinWidth = this.coin.displayWidth;
    const countWidth = this.count.width;
    const totalWidth = coinWidth + countWidth + 20; // 20px padding between coin and count
    this.coin.setPosition(width - coinWidth, height - 28);
    this.count.setPosition(width - totalWidth, height - 32);
  }

  private displayCoins(): void {
    this.coin = this.add.image(0, 0, "coin").setScale(0.3);
    this.count = this.add.text(0, 0, this.coinsCount.toString(), {
      fontSize: "12px",
      fontFamily: '"Press Start 2P"',
    });
    this.recalculateCoinPosition();
  }

  private updateCoinsDisplay(): void {
    this.count.setText(this.coinsCount.toString());
    this.recalculateCoinPosition();
  }

  private payForBoost(booster: string): void {
    if (this.coinsCount < 1) {
      return;
    }
    this.appState.setProp("coins", this.coinsCount - 1);
    this.updateCoinsDisplay();
  }
}
