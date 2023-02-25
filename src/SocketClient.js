import { io } from "socket.io-client";

const socket_url = "ws://localhost:3000/?userId=76209714-53a8-43c7-8c71-d3216d034fec";
export default class SocketClient {
    constructor() {
       
    }
    async createWebSocketConnection() {
    
        const socket = io(socket_url);

        let sdfsdf = socket.on('connect', function () {
            console.log('kết nối thành công');
        });
        console.log(sdfsdf);
       let fvsfdsgs=  socket.on("error", () => {
          });
          console.log(fvsfdsgs);
        socket.emit('groupMessage', {
            "content": "mày là thằng nào hả",
            "groupId": "b2e50fea-b536-4860-af56-0f4fdfa2ddd6",
            "messageType": "text",
            "userId": "76209714-53a8-43c7-8c71-d3216d034fec"
            });
    }
}
