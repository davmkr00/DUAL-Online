export default class Client {
    constructor(enemyBullet, room){
        
        this.wbSocket = new WebSocket(`ws://127.0.0.1:1222/${room}`);
        this.wbSocket.onmessage = (event) => {
            enemyBullet.isFire = true;
            enemyBullet.xBulletPosition = Number(event.data);
        };
        
    }
    sendInfo(info){
        try {
            this.wbSocket.send(info);
        } catch (error) {
            console.log(error);
        }
    }
}

