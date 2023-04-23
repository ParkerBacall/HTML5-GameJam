import Phaser from 'phaser'

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.player = null;
        this.platforms = null
        this.seconds = 1500;
        this.score = 0;
        this.gameOver = false;
        this.player = null;
        this.stars = [];
        this.bombs = [];
        this.cursors = null;
        this.timeText = null;
        this.scoreText = null;
        this.gameOverText = null;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('character',
            'assets/character.png',
            { frameWidth: 60, frameHeight: 74 }
        );
        this.load.spritesheet('teeth', 'assets/teeth.png',
            { frameWidth: 29, frameHeight: 30 });
        this.load.image('bomb', 'assets/bomb.png');
    }

    create() {

        // World
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // Ground
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(600, 590, 'ground');

        // Player
        this.player = this.physics.add.sprite(100, 520, 'character');
        this.player.setBounce(0.2);
        this.player.body.setGravityY(300);

        // Stars
        this.generateStars(this.physics)

        // // Bombs
        this.generateBombs(this.physics)

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

        // Teeth Anims
        this.anims.create({
            key: 'teethAnim',
            frames: this.anims.generateFrameNumbers('teeth', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        // // Time Text
        this.timeText = this.add.text(16, 16, 'Time: 60', { fontSize: '32px', fill: '#000' });


        // // Score Text
        this.scoreText = this.add.text(16, 56, 'Score: 0', { fontSize: '16px', fill: '#000' });
    }

    update() {
        // Player Controls
        if (!this.gameOver) {
            this.player.anims.play('right', true);
            if (this.cursors.space.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-230);
            }
        }

        if (!this.gameOver) {
            this.seconds -= 1
            this.score += 2

            // Time Update
            this.timeText.setText('Time: ' + (this.seconds / 100).toFixed(1))

            // Score Update
            this.scoreText.setText('Score: ' + (this.score / 100).toFixed(0))
        }

        //  Timeout
        if (this.seconds === 0) {
            this.gameOver = true;
        }
        // GameOver
        if (this.gameOver) {
            this.physics.pause();
            this.player.setTint(0xff0000);
            this.player.anims.play('die');
            this.gameOverText = this.add.text(420, 300, 'GAME OVER', { fontSize: '64px', fill: '#FF0000' });

        }

        // update rendered stars
        this.stars.children.iterate(function (child) {
            child.anims.play('teethAnim', true);
            if (child.x < 0) {
                child.disableBody(true, true);
            }
        })

        if (this.stars.countActive(true) === 0) {
            this.generateStars(this.physics)
        }

        // update rendered bombs
        this.bombs.children.iterate(function (child) {
            if (child.x < 0) {
                child.disableBody(true, true);
            }
        })

        if (this.bombs.countActive(true) === 0) {
            this.generateBombs(this.physics)
        }
    }

    collectStar(player, star, physics) {
        star.disableBody(true, true);
        this.seconds += 500
    }

    generateStars(physics) {
        this.stars = physics.add.group({
            key: 'teeth',
            repeat: 1,
            setXY: { x: 1400, y: 542, stepX: 1000 }
        });

        this.stars.children.iterate(function (child) {
            child.body.velocity.x = -260
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    }


    hitBomb(player, bomb) {
        this.gameOver = true
    }

    generateBombs(physics) {
        this.bombs = physics.add.group({
            key: 'bomb',
            repeat: 1,
            setXY: { x: 1300, y: 542, stepX: 1000 }
        });

        this.bombs.children.iterate(function (child) {
            child.body.velocity.x = -260
        });

        physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

}

export default PlayScene;