import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.image(centerX, centerY, 'background')
            .setDisplaySize(width, height)
            .setOrigin(0.5, 0.5);

        const text = this.add.text(width / 2, height / 2, 'Menu', {
            fontFamily: 'Arial Black', 
            fontSize: Math.round(height * 0.05), 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: Math.round(height * 0.01),
            align: 'center'
        }).setOrigin(0.5);

        // click text
        text.setInteractive();
        text.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // this.input.once('pointerdown', () => {
        //     this.scene.start('Game');
        // });
    }
}
