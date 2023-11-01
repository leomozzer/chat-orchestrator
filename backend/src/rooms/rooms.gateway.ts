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
import { ObjectId } from 'mongodb';

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

  private rooms = new Map<string, Set<Socket>>();

  async handleConnection(client: Socket) {
    try {
      console.log(`Client ${client.id} connected on /rooms`)
      const token: string = client.handshake.query.token as string
      const user = await this.authService.validateToken(token)
      if (!user) {
        throw new UnauthorizedException()
      }
      const rooms = await this.roomService.list()
      let chatId = ""
      if (rooms.length === 0) {
        chatId = await this.roomService.create()
      }
      else {
        chatId = String(rooms[0]._id)
      }
      this.server.emit('connected', { 'user_id': user.sub, 'socket': client.id, 'room': chatId })
      //client.emit('connected', { 'user_id': user.sub, 'socket': client.id })
    } catch (error) {
      client.emit('disconnected', 'Authentication failed')
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconneted of /rooms`)
    this.server.emit('disconneted', `Client ${client.id} disconneted of /rooms`)
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('clientMessage')
  async handleMessage(client: any, payload: any) {
    console.log(payload);
    await this.roomService.newMessage(payload.userId, payload.text, payload.room)
    //client.emit('new_message', 'Hello from websocket server');
    this.server.emit('serverMessage', payload)
  }
}
