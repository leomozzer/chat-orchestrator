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
      console.log(client.rooms)
      const token: string = client.handshake.query.token as string
      console.log(token)
      const user = await this.authService.validateToken(token)
      if (!user) {
        throw new UnauthorizedException()
      }
      const type: string = client.handshake.query.type as string
      if (type === 'new') {
        const chatid = await this.roomService.create()
        client.emit('connected', { 'user_id': user.sub, 'socket': client.id, 'room': chatid })
      }
      else {
        const room: string = client.handshake.query.room as string
        client.emit('connected', { 'user_id': user.sub, 'socket': client.id, 'room': room })
      }
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
    const newMessage = await this.roomService.newMessage(payload.user_id, payload.text, payload.room)
    //client.emit('message', 'Hello from websocket server');
    this.server.to(payload['room']).emit('Hello')
    return 'Hello world!';
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    // Add the user to the room
    client.join(roomId);
  }
}
