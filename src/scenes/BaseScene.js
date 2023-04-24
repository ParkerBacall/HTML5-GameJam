import Phaser from 'phaser'

class BaseScene extends Phaser.Scene {

    constructor(key, config) {
        super(key);
        this.config = config;
    }


    create() {
        this.createBackground()
    }


    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }


}

export default BaseScene;