import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

export class LoginDto {
    username: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.username, loginDto.password);
    }

    @Get('current-user')
    async getCurrentUser() {
        // This would typically use a session or JWT token
        // For now, returns the authenticated user from env
        return this.authService.getCurrentUser();
    }
}
