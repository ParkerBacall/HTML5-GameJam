
import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";


const Width = 1200
const Height = 600

const SharedConfig = {
    width: Width,
    height: Height,
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene]
const createScene = Scene => new Scene(SharedConfig)
const initScenes =  () => Scenes.map(createScene)

var config = {
  type: Phaser.AUTO,
  ...SharedConfig,
  physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
  },
  scene: initScenes()
};

const game = new Phaser.Game(config);