
import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";
import InstructionScene from "./scenes/InstructionScene";


const Width = 1200
const Height = 550

const SharedConfig = {
    width: Width,
    height: Height,
    isSoundtrackCreated: false,
    isSoundtrackPlaying: false,
    currentDifficulty: 'easy',
    menuSongPlaying: false,
    difficulties: {
        'easy': {
            speed: -360
        },
        'normal': {
            speed: -460
        },
        'hard': {
            speed: -560
        },
        'extraHard': {
            speed: -660
        }
    },
}

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene, InstructionScene]
const createScene = Scene => new Scene(SharedConfig)
const initScenes = () => Scenes.map(createScene)

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