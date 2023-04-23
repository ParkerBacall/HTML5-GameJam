import Phaser from 'phaser'

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.player = null;
        this.platforms = null
        this.seconds = 750;
        this.score = 0;
        this.gameOver = false;
        this.player = null;
        this.hearts = [];
        this.tentacles = [];
        this.cursors = null;
        this.timeText = null;
        this.scoreText = null;
        this.gameOverText = null;
        this.gravity = 450;
    }

    preload() {
        this.loadBackground()
        this.loadPlatform()
        this.loadCharacter()
        this.loadHearts()
        this.loadTentacles()
    }

    create() {
        this.createBackground()
        this.createPlatform()
        this.createPlayer()
        this.generateHearts(this)
        this.generateTentacles(this)
        this.createPlayerAnimations()
        this.createHeartAnimations()
        this.createTentacleAnimations()
        this.createInputs()
        this.createTimeText()
        this.createScoreText()
    }

    update() {

        this.checkTimeout()

        if (!this.gameOver) {
            this.jump()
            this.updateTime()
            this.updateScore()
        } else {
            this.checkGameOver()
        }

        this.updateHearts()
        this.updateTentacles()
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

    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    createPlatform() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(600, 590, 'platform');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, 520, 'character');
        this.player.setBounce(0.2);
        this.player.body.setGravityY(this.gravity);
        this.physics.add.collider(this.player, this.platforms);
    }

    createPlayerAnimations() {
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
    }

    generateHearts() {
        this.hearts = this.physics.add.group({
            key: 'heart',
            repeat: 1,
            setXY: { x: 1700, y: 542, stepX: 800 }
        });

        this.hearts.children.iterate(function (child) {
            child.body.velocity.x = -360
            child.setBodySize(40, 40)
        });

        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);
    }

    collectHeart(player, heart) {
        heart.disableBody(true, true);
        this.seconds += 250
    }

    createHeartAnimations() {
        this.anims.create({
            key: 'heartAnim',
            frames: this.anims.generateFrameNumbers('hearts', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
    }

    generateTentacles() {
        this.tentacles = this.physics.add.group({
            key: 'tentacle',
            repeat: 1,
            setXY: { x: 1300, y: 590, stepX: 800 }
        });

        this.tentacles.children.iterate(function (child) {
            child.body.velocity.x = -360
        });

        this.physics.add.overlap(this.player, this.tentacles, this.hitTentacle, null, this);
    }

    hitTentacle(player, tentacle) {
        tentacle.disableBody(true, true);
        this.seconds -= 250
        player.setVelocityY(-550)
    }

    createTentacleAnimations() {
        this.anims.create({
            key: 'tentacleAnim',
            frames: this.anims.generateFrameNumbers('tentacle', { start: 0, end: 6 }),
            frameRate: 3,
            repeat: -1
        });

    }

    createInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createTimeText() {
        this.timeText = this.add.text(16, 16, 'Time: 10', { fontSize: '32px', fill: '#000' });
    }

    createScoreText() {
        this.scoreText = this.add.text(16, 56, 'Score: 0', { fontSize: '16px', fill: '#000' });
    }

    jump() {
        this.player.anims.play('right', true);
        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    updateTime() {
        this.seconds -= 1
        this.timeText.setText('Time: ' + (this.seconds / 100).toFixed(1))
    }

    updateScore() {
        this.score += 2
        this.scoreText.setText('Score: ' + (this.score / 100).toFixed(0))
    }

    checkTimeout() {
        if (this.seconds < 0) {
            this.gameOver = true;
        }
    }

    checkGameOver() {
        this.timeText.setText('Time: 0')
        this.player.setTint(0xff0000);
        this.player.anims.play('die');
        this.gameOverText = this.add.text(420, 300, 'GAME OVER', { fontSize: '64px', fill: '#FF0000' })
        this.physics.pause();
    }

    updateHearts() {
        this.hearts.children.iterate(function (child) {
            child.anims.play('heartAnim', true);
            if (child.x < 0) {
                child.disableBody(true, true);
            }
        })

        if (this.hearts.countActive(true) === 0) {
            this.generateHearts(this)
        }
    }

    updateTentacles() {
        this.tentacles.children.iterate(function (child) {
            child.anims.play('tentacleAnim', true);
            switch (child.anims.currentFrame.index) {
                case 1:
                    child.setBodySize(40, 90)
                    break;

                case 2:
                    child.setBodySize(40, 120)
                    break;

                case 3:
                    child.setBodySize(40, 150)
                    break;

                case 4:
                    child.setBodySize(40, 170)
                    break;

                case 5:
                    child.setBodySize(40, 190)
                    break;

                case 6:
                    child.setBodySize(40, 210)
                    break;

                case 7:
                    child.setBodySize(40, 230)

            }

            if (child.x < 0) {
                child.disableBody(true, true);
            }
        })

        if (this.tentacles.countActive(true) === 0) {
            this.generateTentacles(this)
        }
    }

}

export default PlayScene;