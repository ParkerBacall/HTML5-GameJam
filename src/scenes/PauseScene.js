import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {

    constructor(config) {
        super('PauseScene', config);
        this.lineHeight = 42
        this.yPosition = this.screenCenter[1]
        this.fontSize = 32
        this.menu = [
            { scene: 'PlayScene', text: 'Continue' },
            { scene: 'MenuScene', text: 'Exit' }
        ]
    }


    create() {
        super.create()
        this.createMenu(this.menu, this.lineHeight, this.yPosition, this.fontSize, (menuItem) => this.setUpMenuEvents(menuItem))
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
            if (menuItem.scene && menuItem.text === 'Continue') {
                this.scene.stop();
                this.scene.resume(menuItem.scene);
            } else {
                this.scene.stop('PlayScene');
                this.scene.start(menuItem.scene)
                this.config.isSoundtrackCreated = false;
                this.config.isSoundtrackPlaying = false;
                this.playMenuSound()
            }
        })
    }


}

export default PauseScene;