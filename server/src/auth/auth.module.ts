import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RavelryApiService } from '../common/ravelry-api.service';

@Module({
    imports: [HttpModule],
    controllers: [AuthController],
    providers: [AuthService, RavelryApiService],
})
export class AuthModule { }
