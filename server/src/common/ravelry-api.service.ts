import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RavelryApiService {
    private readonly apiUrl: string;
    private readonly accessKey: string;
    private readonly secretKey: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.apiUrl = this.configService.get('RAVELRY_API_URL');
        this.accessKey = this.configService.get('RAVELRY_ACCESS_KEY');
        this.secretKey = this.configService.get('RAVELRY_SECRET_KEY');
    }

    async get(endpoint: string, params?: any, accessToken?: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.apiUrl}${endpoint}`, {
                    params,
                    ...(accessToken
                        ? { headers: { Authorization: `Bearer ${accessToken}` } }
                        : { auth: { username: this.accessKey, password: this.secretKey } }),
                }),
            );
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Ravelry API Error: ${errorMessage}`);
        }
    }

    async post(endpoint: string, data: any, accessToken?: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.apiUrl}${endpoint}`, data, {
                    ...(accessToken
                        ? { headers: { Authorization: `Bearer ${accessToken}` } }
                        : { auth: { username: this.accessKey, password: this.secretKey } }),
                }),
            );
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Ravelry API Error: ${errorMessage}`);
        }
    }
}
