import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.use(
        session({
            secret: configService.get('SESSION_SECRET') || 'fallback-secret',
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            },
        }),
    );

    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    app.setGlobalPrefix('api');

    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}/api`);
}
bootstrap();
