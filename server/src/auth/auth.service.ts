import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface TokenResponse {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
}

@Injectable()
export class AuthService {
    private readonly accessKey: string;
    private readonly secretKey: string;
    private readonly redirectUri: string;
    private readonly apiUrl: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.accessKey = this.configService.get('RAVELRY_ACCESS_KEY');
        this.secretKey = this.configService.get('RAVELRY_SECRET_KEY');
        this.redirectUri = this.configService.get('RAVELRY_REDIRECT_URI');
        this.apiUrl = this.configService.get('RAVELRY_API_URL');
    }

    buildAuthorizationUrl(): string {
        const params = new URLSearchParams({
            client_id: this.accessKey,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: 'offline',
        });
        return `https://www.ravelry.com/oauth2/auth?${params.toString()}`;
    }

    async exchangeCodeForToken(code: string): Promise<TokenResponse> {
        const credentials = Buffer.from(`${this.accessKey}:${this.secretKey}`).toString('base64');

        const response = await firstValueFrom(
            this.httpService.post(
                'https://www.ravelry.com/oauth2/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: this.redirectUri,
                }).toString(),
                {
                    headers: {
                        Authorization: `Basic ${credentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ),
        );
        return response.data;
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
        const credentials = Buffer.from(`${this.accessKey}:${this.secretKey}`).toString('base64');

        const response = await firstValueFrom(
            this.httpService.post(
                'https://www.ravelry.com/oauth2/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }).toString(),
                {
                    headers: {
                        Authorization: `Basic ${credentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
            ),
        );
        return response.data;
    }

    async getCurrentUser(accessToken: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.apiUrl}/current_user.json`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        );
        return response.data.user;
    }
}
