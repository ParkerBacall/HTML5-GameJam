import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {

    constructor(config) {
        super('MenuScene', config);
        this.lineHeight = 42;
        this.yPosition = this.screenCenter[1] + 140
        this.fontSize = 32;
        this.menu = [
            { scene: 'PlayScene', text: 'Play' },
            { scene: 'ScoreScene', text: 'Best Score' },
            { scene: 'InstructionScene', text: 'Instructions' },
        ]
    }

    create() {
        super.create()
        this.createTitle()
        this.createMenu(this.menu, this.lineHeight, this.yPosition, this.fontSize, (menuItem) => this.setUpMenuEvents(menuItem))
        this.createCredits()
        this.playMenuSong()
    }

    createTitle() {
        this.add.image(this.screenCenter[0], 470, 'title').setScale(0.3).setOrigin(0.5, 1)
    }

    playMenuSong() {
        if (!this.config.menuSongPlaying) {
            this.menuSong = this.sound.add('menuSong', { volume: 0.1, loop: true })
            this.menuSong.play()
            this.config.menuSongPlaying = true
        }
    }

    setUpMenuEvents(menuItem) {
        const { textGO } = menuItem;
        textGO.setInteractive();
        textGO.on('pointerover', () => {
            textGO.setStyle({ fill: '#6ae034' });
        })
        textGO.on('pointerout', () => {
            textGO.setStyle({ fill: '#000' });
        })
        textGO.on('pointerup', () => {
            menuItem.scene && this.scene.start(menuItem.scene);

            if (menuItem.text === 'Play') {
                this.menuSong.pause()
                this.config.menuSongPlaying = false
            }

            if (menuItem.text !== 'Play') {
                this.playMenuSound()
            }

            if (menuItem.text === 'Exit') {
                this.game.destroy(true);
            }
        })
    }

    createCredits() {
        this.add.text(this.screenCenter[0], this.config.height, `A game by Parker Bacall, Music and Sound by Chris Denniston © 2023 All Rights Reserved`, { fontSize: '14px', fill: '#000', align: "center" }).setOrigin(0.5, 1);
    }

}

export default MenuScene;