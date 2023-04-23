
import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";

const Width = 1200
const Height = 600

const SharedConfig = {
    width: Width,
    height: Height,
}

var config = {
  type: Phaser.AUTO,
  ...SharedConfig,
  physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
  },
  scene: [new PlayScene(SharedConfig)]
};

const game = new Phaser.Game(config);