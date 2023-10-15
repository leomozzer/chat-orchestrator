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
import { RoomsService } from './rooms.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
  namespace: '/rooms',
  transports: ['websocket'],
  cors: {
    credentials: true,
    methods: ['GET', 'POST']
  }
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly roomService: RoomsService
  ) { }
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected on /rooms`)
    const chatid = await this.roomService.create()
    client.emit('connected', { 'id': uuidv4(), 'socket': client.id, 'room': chatid })
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconneted of /rooms`)
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   console.log(payload);
  //   client.emit('message', 'Hello from websocket server');
  //   return 'Hello world!';
  // }

  @SubscribeMessage('new_message')
  async handleMessage(client: any, payload: any) {
    console.log(payload);
    const newMessage = await this.roomService.newMessage(payload.id, payload.text, payload.room)
    client.emit('message', 'Hello from websocket server');
    return 'Hello world!';
  }
}
