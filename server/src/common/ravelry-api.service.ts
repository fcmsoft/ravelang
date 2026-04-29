import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RavelryApiService {
    private readonly apiUrl: string;
    private readonly username: string;
    private readonly password: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.apiUrl = this.configService.get('RAVELRY_API_URL');
        this.username = this.configService.get('RAVELRY_USERNAME');
        this.password = this.configService.get('RAVELRY_PASSWORD');
    }

    async get(endpoint: string, params?: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}${endpoint}`, {
                    params,
                    auth: {
                        username: this.username,
                        password: this.password,
                    },
                }),
            );
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Ravelry API Error: ${errorMessage}`);
        }
    }

    async post(endpoint: string, data: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.apiUrl}${endpoint}`, data, {
                    auth: {
                        username: this.username,
                        password: this.password,
                    },
                }),
            );
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Ravelry API Error: ${errorMessage}`);
        }
    }
}
