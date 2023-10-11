import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(username, pass)
        if (user?.password !== pass) {
            throw new UnauthorizedException()
        }

        const payload = { sub: user._id, username: username }

        await this.userService.updateLastLogin(user._id)
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
