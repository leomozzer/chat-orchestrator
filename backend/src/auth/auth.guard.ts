import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { Socket } from 'socket.io';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService, private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (isPublic) {
            // 💡 See this condition
            return true;
        }

        if (context.getType() !== 'ws') {
            return true
        }

        const client: Socket = context.switchToWs().getClient();
        const token: string = client.handshake.query.token as string
        if (!token) {
            throw new UnauthorizedException()
        }
        try {
            await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET
            })
        } catch (error) {
            throw new UnauthorizedException()
        }
        // const request = context.switchToHttp().getRequest();
        // const token = this.extractTokenFromHeader(request);
        // if (!token) {
        //     throw new UnauthorizedException()
        // }
        // try {
        //     const payload = await this.jwtService.verifyAsync(token, {
        //         secret: process.env.JWT_TOKEN
        //     })
        //     request['user'] = payload
        // }
        // catch {
        //     throw new UnauthorizedException()
        // }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}