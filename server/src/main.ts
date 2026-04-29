import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable CORS for Angular app
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = configService.get('PORT') || 3000;
    await app.listen(port);
    console.log(`🚀 Server is running on http://localhost:${port}/api`);
}
bootstrap();
