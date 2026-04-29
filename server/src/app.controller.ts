import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getStatus() {
        return {
            status: 'ok',
            message: 'Raverlang API is running',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('health')
    getHealth() {
        return {
            status: 'healthy',
            uptime: process.uptime(),
        };
    }
}
