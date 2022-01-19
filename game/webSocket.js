export default class Client {
    constructor(enemyBullet){
        
        this.wbSocket = new WebSocket("ws://127.0.0.1:1222/");  // 45.61.48.66
        this.wbSocket.onmessage = (event) => {
            console.log(enemyBullet)
            enemyBullet.isFire = true;
            enemyBullet.xBulletPosition = Number(event.data);
        };
    }
    sendBulletPosition(xBulletPosition){
        try {
            this.wbSocket.send(xBulletPosition);
        } catch (error) {
            console.log(error);
        }
    }
}

