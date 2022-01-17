var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


let areaWidth = canvas.width,  areaHeight = canvas.height;
let playerWidth = 100, playerHeight = 100;

let xPosition = (areaWidth / 2) - (playerWidth / 2)
let yPosition = areaHeight - playerHeight
let step = 10

let isMoveRight = false
let isMoveLeft = false
let isMoveUp = false
let isMoveDown = false
let isFire = false

let xFirePosition = xPosition + (playerWidth / 2 - 10)
let yFirePosition = yPosition - 20
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.code  == "ArrowRight") isMoveRight = true;
    if(e.code == 'ArrowLeft') isMoveLeft = true;
    if(e.code == 'ArrowUp') isMoveUp = true;
    if(e.code == 'ArrowDown') isMoveDown = true;
}
function keyUpHandler(e) {
    if(e.code == 'ArrowRight') isMoveRight = false;
    if(e.code == 'ArrowLeft') isMoveLeft = false;
    if(e.code == 'ArrowUp') isMoveUp = false;
    if(e.code == 'ArrowDown') isMoveDown = false;
    if(e.code == 'Space') isFire = true
}

function moveRight(){
    if (xPosition >= areaWidth - playerWidth) return 
    xPosition += step;
}

function moveLeft(){
    if (xPosition <= 0) return 
    xPosition -= step;
}

function moveUp(){
    if (yPosition <= 0) return 
    yPosition -= step
}

function moveDown(){
    if (yPosition >= areaHeight - playerWidth) return 
    yPosition += step;
}

function updateFirePosition(){
    if (isFire) return
    xFirePosition = xPosition + (playerWidth / 2 - 10)
    yFirePosition = yPosition - 40
}


function drawFire(){
    ctx.beginPath();
    ctx.rect(xFirePosition, yFirePosition, 20, 20);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    yFirePosition -= 20
    if (yFirePosition <= 0){
        isFire = false
        yFirePosition = yPosition - 20
    }
}

function movePlayer(){
    if (isMoveRight) moveRight()
    if (isMoveLeft) moveLeft()
    if (isMoveUp) moveUp()
    if (isMoveDown) moveDown()
    updateFirePosition()
}

function drawPlayer(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(xPosition, yPosition, playerWidth, playerHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();
}

function draw(){
    drawPlayer()
    movePlayer()
    if (isFire) drawFire()
    requestAnimationFrame(draw)
}


draw()