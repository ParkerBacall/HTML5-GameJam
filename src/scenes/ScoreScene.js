import BaseScene from "./BaseScene";

class ScoreScene extends BaseScene {

    constructor(config) {
        super('ScoreScene', { ...config, hasBackButton: true });
        this.fontSize = 32;

    }


    create() {
        super.create()
        const bestScore = localStorage.getItem('bestScore')
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, { fontSize: `${this.fontSize}px`, fill: '#000000' })
            .setOrigin(0.5)

        if (bestScore > 100) {
            this.add.text(this.screenCenter[0], this.screenCenter[1] + 42, 'Congrats you are a top player ;)', { fontSize: `${this.fontSize}px`, fill: '#6ae034' })
                .setOrigin(0.5)
        }
    }


}

export default ScoreScene;