
import Phaser from "phaser";


var config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 800,
  physics: {
      default: 'arcade',
      arcade: {
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

const game = new Phaser.Game(config);

let seconds = 1500;
let score = 0;
let gameOver = false;
let player = null;
let stars = [];
let bombs = [];
let platforms = null;
let cursors = null;
let timeText = null;
let scoreText  = null;
let gameOverText  = null;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.spritesheet('character',
      'assets/character.png',
      { frameWidth: 60, frameHeight: 74 }
  );
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');

}

function create() {

  // World
  this.add.image(0, 0, 'background').setOrigin(0, 0);

  // Ground
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 668, 'ground').setScale(4).refreshBody();

  // Player
  player = this.physics.add.sprite(100, 570, 'character');
  player.setBounce(0.2);
  player.body.setGravityY(300);

  // Stars
  generateStars(this.physics)


  // Bombs
  generateBombs(this.physics)

  // Player Anims
  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1
  });

  this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('character', { start: 5, end: 7 }),
      frameRate: 10,
      repeat: -1
  });

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();

  // Time Text
  timeText = this.add.text(16, 16, 'Time: 60', { fontSize: '32px', fill: '#000' });


  // Score Text
  scoreText = this.add.text(16, 56, 'Score: 0', { fontSize: '16px', fill: '#000' });
}

function update() {
  // Player Controls
  if (!gameOver) {
      player.anims.play('right', true);
      if (cursors.space.isDown && player.body.touching.down) {
          player.setVelocityY(-230);
      }
  }

  if (!gameOver) {
      seconds -= 1
      score += 2

      // Time Update
      timeText.setText('Time: ' + (seconds / 100).toFixed(1))

      // Score Update
      scoreText.setText('Score: ' + (score / 100).toFixed(0))
  }

  //  Timeout
  if (seconds === 0) {
      gameOver = true;
  }
  // GameOver
  if (gameOver) {
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('die');
      gameOverText = this.add.text(420, 300, 'GAME OVER', { fontSize: '64px', fill: '#FF0000' });

  }

  // update rendered stars
  stars.children.iterate(function (child) {
      if (child.x < 0) {
          child.disableBody(true, true);
      }
  })

  if (stars.countActive(true) === 0) {
      generateStars(this.physics)
  }

  // update rendered bombs
  bombs.children.iterate(function (child) {
      if (child.x < 0) {
          child.disableBody(true, true);
      }
  })

  if (bombs.countActive(true) === 0) {
      generateBombs(this.physics)
  }

}

function collectStar(player, star, physics) {
  star.disableBody(true, true);
  seconds += 500
}

function generateStars(physics) {
  stars = physics.add.group({
      key: 'star',
      repeat: 1,
      setXY: { x: 1400, y: 592, stepX: 1000 }
  });

  stars.children.iterate(function (child) {
      child.body.velocity.x = -260
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  physics.add.overlap(player, stars, collectStar, null, this);
}


function hitBomb(player, bomb) {
  gameOver = true
}

function generateBombs(physics) {
  bombs = physics.add.group({
      key: 'bomb',
      repeat: 1,
      setXY: { x: 1300, y: 592, stepX: 1000 }
  });

  bombs.children.iterate(function (child) {
      child.body.velocity.x = -260
  });

  physics.add.collider(player, bombs, hitBomb, null, this);
}

