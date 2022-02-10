import Client from './webSocket.js'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const areaWidth = canvas.width,  areaHeight = canvas.height;
const url = window.location.href
const paths = url.split('/')
const room = paths[paths.length - 2]




class Bullet {
    constructor() {
        this.xBulletPosition = 0;
        this.yBulletPosition = 0;
        this.bulletWidth = 20;
        this.bulletHeight = 20; 
        this.bulletSpeed = 25;
        this.isFire = false;
    }
}

class Player extends Bullet {
    constructor() {
        super()
        this.width = 100;
        this.height = 100;
        this.xPosition = areaWidth / 2 - this.width / 2;
        this.yPosition = areaHeight - this.height;
        this.speed = 10;
        this.xBulletPosition = this.xPosition + (this.width / 2 - this.bulletWidth / 2);
        this.yBulletPosition = this.yPosition - 20;
    }
}

class Actions {
    constructor() {
        this.player = new Player()
    }
    
    static keyDownHandler(e) {
        if(e.code  == "ArrowRight") this.isMoveingRight = true;
        if(e.code == 'ArrowLeft') this.isMoveingLeft = true;
        if(e.code == 'ArrowUp') this.isMoveingUp = true;
        if(e.code == 'ArrowDown') this.isMoveingDown = true;
    }
    static keyUpHandler(e) {
        if(e.code == 'ArrowRight') this.isMoveingRight = false;
        if(e.code == 'ArrowLeft') this.isMoveingLeft = false;
        if(e.code == 'ArrowUp') this.isMoveingUp = false;
        if(e.code == 'ArrowDown') this.isMoveingDown = false;
        if(e.code == 'Space') this.player.isFire = true
    }

    movePlayer() {
        if (this.isMoveingRight) this.moveRight();
        if (this.isMoveingLeft) this.moveLeft();
        if (this.isMoveingUp) this.moveUp();
        if (this.isMoveingDown) this.moveDown();
        if (!this.player.isFire) this.moveBullet();
    }

    moveRight() {
        if (this.player.xPosition >= areaWidth - this.player.width) return 
        this.player.xPosition += this.player.speed;
    }
    
    moveLeft() {
        if (this.player.xPosition <= 0) return 
        this.player.xPosition -= this.player.speed;
    }
    
    moveUp() {
        if (this.player.yPosition <= 0) return 
        this.player.yPosition -= this.player.speed;
    }
    
    moveDown() {
        if (this.player.yPosition >= areaHeight - this.player.width) return
        this.player.yPosition += this.player.speed;
    }

    moveBullet() {
        this.player.xBulletPosition = this.player.xPosition + (this.player.width / 2 - this.player.bulletWidth / 2);
        this.player.yBulletPosition = this.player.yPosition - this.player.bulletSpeed;
    }
}

class Game extends Actions {
    constructor() {
        super()
        this.health = 100
        this.showHealth()
        this.defultBullet = new Bullet()
        this.defultPlayer = new Player()
    }

    drawPlayer() {
        Game.update(this.player.xPosition, this.player.yPosition, this.player.width, this.player.height, "green")
    }
    
    drawBullet() {
        if (!this.player.isFire) return 
        Game.update(this.player.xBulletPosition, this.player.yBulletPosition, 
            this.player.bulletWidth, this.player.bulletHeight, "black")
            this.player.yBulletPosition -= this.player.bulletSpeed
        if (this.player.yBulletPosition <= 0){
            wbSocket.sendInfo(this.player.xBulletPosition)
            this.player.isFire = this.defultPlayer.isFire
            this.player.yBulletPosition = this.defultPlayer.yBulletPosition
        }
    }

    drawEnemyBullet() {
        Game.update(enemyBullet.xBulletPosition, enemyBullet.yBulletPosition, 
            enemyBullet.bulletWidth, enemyBullet.bulletWidth, 'black')
        enemyBullet.yBulletPosition += enemyBullet.bulletSpeed;
        if (enemyBullet.yBulletPosition >= areaHeight){
            enemyBullet.yBulletPosition = this.defultBullet.yBulletPosition;
            enemyBullet.isFire = this.defultBullet.isFire;
        }
        this.checkDamage()
    }

    checkDamage() {
        if (enemyBullet.yBulletPosition + enemyBullet.bulletHeight >= this.player.yPosition) {
            if ((this.player.xPosition + this.player.width >= enemyBullet.xBulletPosition && 
                    enemyBullet.xBulletPosition >= this.player.xPosition) || 
                (this.player.xPosition + this.player.width >= enemyBullet.xBulletPosition + enemyBullet.bulletWidth && 
                    enemyBullet.xBulletPosition + enemyBullet.bulletWidth >= this.player.xPosition)) {
                this.hitBullet()
            }
        }
    }
    
    hitBullet() {
        enemyBullet.isFire = this.defultBullet.isFire;
        enemyBullet.yBulletPosition = this.defultBullet.yBulletPosition;
        this.health -= 10;
        this.showHealth()
    }

    showHealth() {
        if (this.health <= 0){
            this.loseGame()
        }
        document.getElementById("hp").innerHTML = 'Health:' + this.health
    }

    loseGame() {
        console.log("Game Over")
        wbSocket.sendInfo("Game Over")
        alert("You Lose")
        this.restartGame()
    }

    winGame() {
        console.log("Game Over")
        alert("You Win")
        this.restartGame()
    }
    
    restartGame() {
        this.player = new Player()
        this.health = 100
        this.showHealth()
        
    }


    static update(xPosition, yPosition, widthSize, heightSize, color) {
        ctx.beginPath();
        ctx.rect(xPosition, yPosition, widthSize, heightSize);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}

let enemyBullet = new Bullet()
let game = new Game()
let wbSocket = new Client(enemyBullet, room, game.winGame.bind(game))
document.addEventListener("keydown", Game.keyDownHandler.bind(game));
document.addEventListener("keyup", Game.keyUpHandler.bind(game));
function draw() {
    ctx.clearRect(0, 0, areaWidth, areaHeight);
    game.drawPlayer()
    game.movePlayer()
    if (enemyBullet.isFire) game.drawEnemyBullet()
    game.drawBullet()
    requestAnimationFrame(draw)
}

draw()
