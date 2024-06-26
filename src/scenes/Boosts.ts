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
      icon: "card-doge",
      price: 1,
      level: 1,
    },
    {
      name: "Magnet",
      icon: "card-doge",
      price: 1,
      level: 1,
    },
  ];
  private memeBoosts = [
    {
      name: "Shield",
      icon: "card-doge",
      price: 1,
      level: 1,
    },
    {
      name: "Jump",
      icon: "card-doge",
      price: 1,
      level: 1,
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
      .image(75, this.cameras.main.height - 30, "back-button")
      .setScale(0.12)
      .setDepth(5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.stop().launch("Game").launch("HUD");
      });
  }

  private createBoostsButtons(): void {
    const { width } = this.scale;

    this.boostsButtonsContainer = this.add.container(width / 2, 80);
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
    const screenWidth = this.cameras.main.width;
    const screenHeight = this.cameras.main.height;

    const margin = 10;
    const spacingX = 50;
    const spacingY = 80;
    const containerHeight = 40;
    const containerMarginTop = 20;

    const rows = 2;
    const cols = 2;

    // Available space for cards
    const availableWidth = screenWidth - 2 * margin - (cols - 1) * spacingX;
    const availableHeight =
      screenHeight -
      margin -
      (rows - 1) * spacingY -
      containerHeight -
      containerMarginTop -
      160; // Considering some top space

    // Card original dimensions (update these to the actual dimensions if known)
    const originalCardWidth = 220;
    const originalCardHeight = 310;
    const cardRatio = originalCardWidth / originalCardHeight;

    // Calculate card dimensions to fit within the available space while maintaining aspect ratio
    const maxCardWidth = availableWidth / cols;
    const maxCardHeight = availableHeight / rows;

    let cardWidth = maxCardWidth;
    let cardHeight = maxCardHeight;

    if (maxCardWidth / cardRatio < maxCardHeight) {
      cardHeight = maxCardWidth / cardRatio;
    } else {
      cardWidth = maxCardHeight * cardRatio;
    }

    const totalUsedWidth = cardWidth * cols + (cols - 1) * spacingX;

    const startX = (screenWidth - totalUsedWidth) / 2;
    const startY = 110; // Adjust to center vertically

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (cardWidth + spacingX);
        const y = startY + row * (cardHeight + spacingY);
        const cardContainer = this.add.container(x, y);
        const boostItem = this.currentBoosts[row * 2 + col];
        if (!boostItem) continue;
        const cardImage = this.add
          .image(0, 0, boostItem.icon)
          .setDisplaySize(cardWidth, cardHeight)
          .setOrigin(0, 0);

        cardContainer.add(cardImage); // Add the card image to the container

        // Create container for price and coin
        const priceContainer = this.add.container(
          0,
          cardHeight + containerMarginTop - 10
        );

        const borderGraphics = this.add.graphics();
        borderGraphics.lineStyle(3, 0x000000, 1);
        borderGraphics.strokeRoundedRect(0, 0, cardWidth, containerHeight, 8);

        const priceText = boostItem.price.toString();
        const priceStyle = { fontSize: "24px", color: "#000" };
        const price = this.add.text(0, 0, priceText, priceStyle);

        const coin = this.add.image(0, 0, "coin").setScale(0.4);
        const coinWidth = coin.displayWidth;
        const priceWidth = price.width;
        const totalWidth = coinWidth + priceWidth;

        coin.setPosition(cardWidth / 2 - totalWidth / 2 + coinWidth / 2, 20); // Adjusted y to better center it inside container
        price.setPosition(cardWidth / 2 - totalWidth / 2 + coinWidth + 5, 7);

        priceContainer.add(borderGraphics);
        priceContainer.add(coin);
        priceContainer.add(price);

        const updatePricePosition = () => {
          const coinWidth = coin.displayWidth;
          const priceWidth = price.width;
          const totalWidth = coinWidth + priceWidth;
          coin.setPosition(cardWidth / 2 - totalWidth / 2 + coinWidth / 2, 20);
          price.setPosition(cardWidth / 2 - totalWidth / 2 + coinWidth + 5, 7); // 5px padding between coin and price
        };

        // Add interactive rectangle for priceContainer
        const priceInteractiveRect = this.add
          .rectangle(
            cardWidth / 2,
            containerHeight / 2,
            cardWidth,
            containerHeight,
            0xffffff,
            0
          )
          .setInteractive({ useHandCursor: true })
          .on("pointerdown", () => {
            this.payForBoost(boostItem.name);
            price.setText(boostItem.price.toString());
            level.setText(boostItem.level.toString());
            updatePricePosition();
          })
          .on("pointerover", () => {
            priceInteractiveRect.fillAlpha = 0.2;
          })
          .on("pointerout", () => {
            priceInteractiveRect.fillAlpha = 0;
          });

        priceContainer.add(priceInteractiveRect);

        // Add price and coin icon
        const levelText = boostItem.level.toString();
        const levelTextStyle = { fontSize: "24px", color: "#fff" };
        const level = this.add.text(0, 0, levelText, levelTextStyle);

        level.setPosition(
          cardImage.displayWidth * 0.14,
          cardImage.displayHeight * 0.81
        );

        cardContainer.add(level);

        const descriptionText = "5 seconds";
        const descriptionTextStyle = {
          fontSize: "14px",
          color: "#fff",
          fontStyle: "normal",
          fontFamily: '"Arial"',
        };

        const description = this.add
          .text(0, 0, descriptionText, descriptionTextStyle)
          .setOrigin(0.5, 0.5);
        description.setPosition(
          cardImage.displayWidth * 0.64,
          cardImage.displayHeight * 0.87
        );
        cardContainer.add(description);

        cardContainer.add(priceContainer);
        this.cardsContainer.add(cardContainer);
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

  private payForBoost(boosterName: string): void {
    if (this.coinsCount < 1) {
      return;
    }
    const booster = this.currentBoosts.find(
      (item) => item.name === boosterName
    );

    if (!booster) return;
    if (booster.price > this.coinsCount) return;

    this.appState.setProp("coins", this.coinsCount - booster.price);
    booster.level++;
    booster.price = booster.price * 2;
    this.updateCoinsDisplay();
  }
}
