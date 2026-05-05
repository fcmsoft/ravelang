import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DesignersController } from './designers.controller';
import { DesignersService } from './designers.service';
import { RavelryApiService } from '../common/ravelry-api.service';

@Module({
    imports: [HttpModule],
    controllers: [DesignersController],
    providers: [DesignersService, RavelryApiService],
})
export class DesignersModule { }
