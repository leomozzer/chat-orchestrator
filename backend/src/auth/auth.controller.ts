import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    singIn(@Body() signInDto: Record<string, any>) {
        //         HINT
        // Ideally, instead of using the Record<string, any> type, we should use a DTO class to define the shape of the request body. See the validation chapter for more information.
        return this.authService.signIn(signInDto.username, signInDto.password)
    }

    // @UseGuards(AuthGuard)
    // @Get('profile')
    // getProfile
}
