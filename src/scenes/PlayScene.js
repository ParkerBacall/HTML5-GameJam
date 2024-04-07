import BaseScene from "./BaseScene";

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
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
        this.soundtrack = null;
        this.jumpSound = null;
        this.heartSound = null;
        this.tentacleSound = null;
        this.dieSound = null;
    }

    create() {
        super.create()
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
        this.setGameOver()
        this.createSoundtrack()
        this.playSoundtrack()
        this.createPause()
        this.listenForEvents()
        this.createJumpSound()
        this.createHeartSound()
        this.createDieSound()
        this.createTentacleSound()
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

        this.hearts.children.entries.forEach(heart => {
            heart.body.velocity.x = this.config.difficulties[this.config.difficulty].speed
        })

        this.tentacles.children.entries.forEach(tentacle => {
            tentacle.body.velocity.x = this.config.difficulties[this.config.difficulty].speed
        })
    }


    listenForEvents() {
        this.events.on('resume', () => {
            this.physics.resume()
            this.soundtrack.resume()
        })
    }

    createBackground() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
    }

    createSoundtrack() {
        if (!this.config.isSoundtrackCreated || this.config.isSoundtrackCreated === false) {
            this.soundtrack = this.sound.add('triumph', 1, true);
            this.config.isSoundtrackCreated = true;
        }
    }

    createPlatform() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(600, this.config.height - 10, 'platform');
    }

    createPlayer() {
        this.player = this.physics.add.sprite(100, this.config.height - 60, 'character');
        // this.player.setBounce(0.2);
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

    createPause() {
        const pauseButton = this.add.image(this.config.width - 20, 60, 'pause')
            .setOrigin(1)
            .setInteractive();

        pauseButton.on('pointerdown', () => {
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene')
            this.soundtrack.pause();
        })
    }

    createJumpSound() {
        this.jumpSound = this.sound.add('jump');
    }

    createTentacleSound() {
        this.tentacleSound = this.sound.add('tentacleSound');
    }

    createHeartSound() {
        this.heartSound = this.sound.add('heartSound');
    }

    createDieSound() {
        this.dieSound = this.sound.add('die');
    }

    generateHearts() {
        this.hearts = this.physics.add.group({
            key: 'heart',
            repeat: 1,
            setXY: { x: 1700, y: this.config.height - 45, stepX: 800 },
        });

        this.physics.add.overlap(this.player, this.hearts, this.collectHeart, null, this);
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    collectHeart(player, heart) {
        heart.disableBody(true, true);
        this.seconds += 250
        this.heartSound.play()
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
            setXY: { x: 1300, y: this.config.height - 10, stepX: 800 },
        });

        this.physics.add.overlap(this.player, this.tentacles, this.hitTentacle, null, this);
    }

    hitTentacle(player, tentacle) {
        tentacle.disableBody(true, true);
        this.seconds -= 250
        if (this.seconds > 0) {
            this.tentacleSound.play()
            player.setVelocityY(-550)

        }
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
        this.seconds = 750;
        this.timeText = this.add.text(16, 16, 'Time: 10', { fontSize: '32px', fill: '#000' });
    }

    createScoreText() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore')
        this.scoreText = this.add.text(16, 56, 'Score: 0', { fontSize: '16px', fill: '#000' });
        this.add.text(16, 76, `Best Score: ${bestScore || 0}`, { fontSize: '14px', fill: '#000' });
        if (parseInt(bestScore) > 100){
            this.add.text(16, 96, 'Check score page!', { fontSize: '14px', fill: '#6ae034' });
        }
    }

    setGameOver() {
        this.gameOver = false;
    }

    playSoundtrack() {
        if (!this.config.isSoundtrackPlaying || this.config.isSoundtrackPlaying === false) {
            this.soundtrack.play()
            this.config.isSoundtrackPlaying = true
        }
    }

    jump() {
        this.player.anims.play('right', true);
        if (this.cursors.space.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
            this.jumpSound.play()
        }
        this.input.on('pointerdown', () => {
            if (this.player.body.touching.down) {
                this.player.setVelocityY(-330);
                this.jumpSound.play()
            }
        })
    }

    updateTime() {
        this.seconds -= 1
        this.timeText.setText('Time: ' + (this.seconds / 100).toFixed(1))
    }

    updateScore() {
        this.score += 2
        this.scoreText.setText('Score: ' + (this.score / 100).toFixed(0))
        this.increaseDifficulty()
    }

    increaseDifficulty() {
        if (this.score > 1500 && this.score < 3000) {
            this.config.difficulty = 'normal'
        } else if (this.score > 3001 && this.score < 5000) {
            this.config.difficulty = 'hard'
        } else if (this.score > 5001) {
            this.config.difficulty = 'extraHard'
        } else {
            this.config.difficulty = 'easy'
        }

    }

    checkTimeout() {
        if (this.seconds < 0) {
            this.gameOver = true;
        }
    }

    checkGameOver() {
        this.dieSound.play()
        this.timeText.setText('Time: 0')
        this.player.setTint(0xff0000);
        this.player.anims.play('die');
        this.gameOverText = this.add.text(420, 300, 'GAME OVER', { fontSize: '64px', fill: '#FF0000' })
        this.physics.pause();

        this.setBestScore()

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.dieSound.stop()
                this.scene.restart();
            },
            loop: false
        })
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
                    break;

            }

            if (child.x < 0) {
                child.disableBody(true, true);
            }
        })

        if (this.tentacles.countActive(true) === 0) {
            this.generateTentacles(this)
        }
    }

    setBestScore() {
        const bestScoreText = localStorage.getItem('bestScore')
        const bestScore = bestScoreText && parseInt(bestScoreText)

        if (!bestScore || (this.score / 100).toFixed(0) > bestScore) {
            localStorage.setItem('bestScore', (this.score / 100).toFixed(0))
        }

    }

}

export default PlayScene;