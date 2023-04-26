import BaseScene from "./BaseScene";

class InstructionScene extends BaseScene {

    constructor(config) {
        super('InstructionScene', { ...config, hasBackButton: true });
        this.yPositon = this.screenCenter[1] - 140;
        this.lineHeight = 70;
        this.fontSize = 26;

        this.menu = [
            { scene: 'null', text: 'Press space to jump' },
            { scene: 'null', text: 'If you run out of time you will lose' },
            { scene: 'null', text: 'Collect hearts to increase time limit' },
            { scene: 'null', text: 'Running into tentacles will decrease time limit' },
            { scene: 'null', text: 'Difficulty increases as time goes on' },
            { scene: 'null', text: 'Reach a score of 100 for a special prize on score page ;)' },
        ]
    }

    create() {
        super.create()
        this.createMenu(this.menu, this.lineHeight, this.yPositon, this.fontSize, () => null)

    }

}

export default InstructionScene;