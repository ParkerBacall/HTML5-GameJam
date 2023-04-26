import Phaser from 'phaser'

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [config.width / 2, config.height / 2]
        this.menuSound = null
        this.menuSong = null
    }

    create() {
        this.createBackground()
        this.createMenuSound()

        if (this.config.hasBackButton) {
            const backButton = this.add.image(10, 10, 'back').setOrigin(0)
                .setInteractive()

            backButton.on('pointerup', () => {
                this.scene.start('MenuScene')
                this.playMenuSound()
            })
        }
    }

    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    createMenuSound() {
        this.menuSound = this.sound.add('jump');
    }


    createMenu(menu, lineHeight, yPosition, fontSize) {
        let lastMenuPositionY = 0;
        menu.forEach(menuItem => {
            const menuPosition = [this.screenCenter[0], yPosition + lastMenuPositionY]

            menuItem.textGO = this.add.text(...menuPosition, menuItem.text, { fontSize: `${fontSize}px`, fill: '#000000' }).setOrigin(0.5, 1)
            lastMenuPositionY += lineHeight;
            if (this.setUpMenuEvents) {
                this.setUpMenuEvents(menuItem)
            }
        })
    }

    playMenuSound() {
        this.menuSound.play()
    }


}

export default BaseScene;