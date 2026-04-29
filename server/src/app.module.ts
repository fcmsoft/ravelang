import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PatternsModule } from './patterns/patterns.module';
import { YarnsModule } from './yarns/yarns.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        HttpModule,
        PatternsModule,
        YarnsModule,
        AuthModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
