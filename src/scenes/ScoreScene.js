import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', {...config, hasBackButton: true});
        this.fontSize = 32;

    }


    create() {
        super.create()
        const bestScore = localStorage.getItem('bestScore')
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, { fontSize: `${this.fontSize}px`, fill: '#000000' })
        .setOrigin(0.5)
    }


}

export default ScoreScene;