import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/rooms', transports: ['websocket'], cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true,
  }
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected on /rooms`)
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconneted of /rooms`)
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(payload);
    client.emit('message', 'Hello from websocket server');
    return 'Hello world!';
  }
}
