import Phaser from 'phaser'


class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.loadBackground()
        this.loadPlatform()
        this.loadCharacter()
        this.loadHearts()
        this.loadTentacles()
        this.loadSoundtrack()
        this.loadPause()
        this.loadBackButton()
    }

    create() {
        this.scene.start("MenuScene")
       
    }

    loadBackground() {
        this.load.image('background', 'assets/background.png');
    }

    loadBackground() {
        this.load.image('background', 'assets/background.png');
    }

    loadPlatform() {
        this.load.image('platform', 'assets/platform.png');
    }

    loadCharacter() {
        this.load.spritesheet('character',
            'assets/character.png',
            { frameWidth: 60, frameHeight: 74 }
        );
    }

    loadHearts() {
        this.load.spritesheet('hearts', 'assets/hearts.png',
            { frameWidth: 50, frameHeight: 50 });
    }

    loadTentacles() {
        this.load.spritesheet('tentacle', 'assets/tentacle.png',
            { frameWidth: 39, frameHeight: 240 },
        )
    }

    loadSoundtrack() {
        this.load.audio('triumph', 'assets/triumph.wav')
    }

    loadPause() {
        this.load.image('pause', 'assets/pause.png')
    }

    loadBackButton() {
        this.load.image('back', 'assets/back.png')
    }


}

export default PreloadScene;