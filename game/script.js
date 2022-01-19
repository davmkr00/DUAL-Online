import Client from './webSocket.js'

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let areaWidth = canvas.width,  areaHeight = canvas.height;

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

class Actions extends Player {
    constructor() {
        super()
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
        if(e.code == 'Space') player.isFire = true
    }

    movePlayer() {
        if (this.isMoveingRight) this.moveRight();
        if (this.isMoveingLeft) this.moveLeft();
        if (this.isMoveingUp) this.moveUp();
        if (this.isMoveingDown) this.moveDown();
        if (!player.isFire) this.moveBullet();
    }

    moveRight() {
        if (player.xPosition >= areaWidth - player.width) return 
        player.xPosition += player.speed;
    }
    
    moveLeft() {
        if (player.xPosition <= 0) return 
        player.xPosition -= player.speed;
    }
    
    moveUp() {
        if (player.yPosition <= 0) return 
        player.yPosition -= player.speed;
    }
    
    moveDown() {
        if (player.yPosition >= areaHeight - player.width) return
        player.yPosition += player.speed;
    }

    moveBullet() {
        player.xBulletPosition = player.xPosition + (player.width / 2 - player.bulletWidth / 2);
        player.yBulletPosition = player.yPosition - player.bulletSpeed;
    }
}

class Game extends Actions {
    constructor() {
        super()
        this.health = 100
        this.showHealth()
    }

    drawPlayer() {
        Game.update(player.xPosition, player.yPosition, player.width, player.height, "green")
    }
    
    drawBullet() {
        Game.update(player.xBulletPosition, player.yBulletPosition, 
            player.bulletWidth, player.bulletHeight, "black")
        player.yBulletPosition -= player.bulletSpeed
        if (player.yBulletPosition <= 0){
            wbSocket.sendBulletPosition(player.xBulletPosition)
            player.isFire = this.isFire
            player.yBulletPosition = this.yBulletPosition
        }
    }

    drawEnemyBullet() {
        Game.update(enemyBullet.xBulletPosition, enemyBullet.yBulletPosition, 
            enemyBullet.bulletWidth, enemyBullet.bulletWidth, 'black')
        enemyBullet.yBulletPosition += enemyBullet.bulletSpeed;
        if (enemyBullet.yBulletPosition >= areaHeight){
            enemyBullet.yBulletPosition = 0;  // TODO and in hit bullet
            enemyBullet.isFire = false;
        }
        this.checkDamage()
    }

    checkDamage() {
        if (enemyBullet.yBulletPosition + enemyBullet.bulletHeight >= player.yPosition) {
            if ((player.xPosition + player.width >= enemyBullet.xBulletPosition && 
                    enemyBullet.xBulletPosition >= player.xPosition) || 
                (player.xPosition + player.width >= enemyBullet.xBulletPosition + enemyBullet.bulletWidth && 
                    enemyBullet.xBulletPosition + enemyBullet.bulletWidth >= player.xPosition)) {
                this.hitBullet()
            }
        }
    }

    hitBullet() {
        enemyBullet.isFire = false;
        enemyBullet.yBulletPosition = 0;
        this.health -= 10;
        this.showHealth()
    }

    showHealth() {
        document.getElementById("hp").innerHTML = 'Health:' + this.health
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
let player = new Player()
let game = new Game()
let wbSocket = new Client(enemyBullet)
document.addEventListener("keydown", Game.keyDownHandler.bind(game));
document.addEventListener("keyup", Game.keyUpHandler.bind(game));
function draw() {
    ctx.clearRect(0, 0, areaWidth, areaHeight);
    game.drawPlayer()
    game.movePlayer()
    if (enemyBullet.isFire) game.drawEnemyBullet()
    if (player.isFire) game.drawBullet()
    requestAnimationFrame(draw)
}

draw()
