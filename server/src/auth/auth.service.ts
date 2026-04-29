import { Injectable } from '@nestjs/common';
import { RavelryApiService } from '../common/ravelry-api.service';

@Injectable()
export class AuthService {
    constructor(private readonly ravelryApi: RavelryApiService) { }

    async login(username: string, password: string) {
        try {
            // Verify credentials by fetching current user
            const user = await this.ravelryApi.get('/current_user.json');

            return {
                success: true,
                user: user.user,
                message: 'Login successful',
            };
        } catch (error) {
            return {
                success: false,
                message: 'Invalid credentials',
            };
        }
    }

    async getCurrentUser() {
        try {
            const response = await this.ravelryApi.get('/current_user.json');
            return response.user;
        } catch (error) {
            throw new Error('Failed to fetch current user');
        }
    }
}
