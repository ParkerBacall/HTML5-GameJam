import Phaser from 'phaser'

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2]
        this.fontSize = 32;
        this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#000000' };
        this.lineHeight = 42;
    }


    create() {
        this.createBackground()

        if (this.config.hasBackButton) {
            const backButton = this.add.image(10, 10, 'back').setOrigin(0)
                .setInteractive()

            backButton.on('pointerup', () => {
                this.scene.start('MenuScene')
            })
        }
    }


    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    createMenu(menu) {
        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY]

            menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1)
            lastMenuPositionY += this.lineHeight;

            this.setUpMenuEvents(menuItem)
        })
    }


}

export default BaseScene;