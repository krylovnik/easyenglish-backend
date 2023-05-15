import {Body, Controller, HttpCode, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from './auth.service';
import {RegisterDto} from './dto/register.dto'
import {LoginDto} from "./dto/login.dto";
import {refreshTokenDto} from "./dto/refreshToken.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }


    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @UsePipes(new ValidationPipe())
    @Post('login/tokens')
    async getNewTokens(@Body() dto: refreshTokenDto) {
        return this.authService.getNewTokens(dto)
    }
}
