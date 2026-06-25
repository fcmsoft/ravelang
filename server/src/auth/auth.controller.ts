import { Controller, Get, HttpCode, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    private readonly clientOrigin: string;

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        this.clientOrigin = this.configService.get('CORS_ORIGIN') || 'http://localhost:4200';
    }

    @Get('ravelry')
    redirectToRavelry(@Res() res: Response) {
        const url = this.authService.buildAuthorizationUrl();
        res.redirect(url);
    }

    @Get('callback')
    async handleCallback(
        @Query('code') code: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        if (!code) {
            return res.redirect(`${this.clientOrigin}?auth_error=missing_code`);
        }

        try {
            const tokens = await this.authService.exchangeCodeForToken(code);
            const user = await this.authService.getCurrentUser(tokens.access_token);

            req.session.accessToken = tokens.access_token;
            req.session.refreshToken = tokens.refresh_token;
            req.session.user = {
                id: user.id,
                username: user.username,
                large_photo_url: user.large_photo_url,
                small_photo_url: user.small_photo_url,
                tiny_photo_url: user.tiny_photo_url,
            };

            res.redirect(this.clientOrigin);
        } catch {
            res.redirect(`${this.clientOrigin}?auth_error=token_exchange_failed`);
        }
    }

    @Get('me')
    getMe(@Req() req: Request) {
        if (!req.session.user) {
            throw new UnauthorizedException();
        }
        return req.session.user;
    }

    @Post('logout')
    @HttpCode(200)
    logout(@Req() req: Request, @Res() res: Response) {
        req.session?.destroy(() => {
            res.json({ success: true });
        });
    }
}
