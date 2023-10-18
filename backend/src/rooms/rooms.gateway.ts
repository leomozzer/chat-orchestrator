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
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

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
    private readonly roomService: RoomsService,
    private readonly authService: AuthService
  ) { }
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      console.log(`Client ${client.id} connected on /rooms`)
      const token: string = client.handshake.query.token as string
      console.log(token)
      const user = this.authService.validateToken(token)
      if (!user) {
        throw new UnauthorizedException()
      }
      const chatid = await this.roomService.create()
      client.emit('connected', { 'id': uuidv4(), 'socket': client.id, 'room': chatid })
    } catch (error) {
      client.emit('disconnected', 'Authentication failed')
      client.disconnect()
    }
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

  @UseGuards(AuthGuard)
  @SubscribeMessage('new_message')
  async handleMessage(client: any, payload: any) {
    console.log(payload);
    const newMessage = await this.roomService.newMessage(payload.id, payload.text, payload.room)
    client.emit('message', 'Hello from websocket server');
    return 'Hello world!';
  }
}
