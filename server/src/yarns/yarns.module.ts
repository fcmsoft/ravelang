import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YarnsController } from './yarns.controller';
import { YarnsService } from './yarns.service';
import { RavelryApiService } from '../common/ravelry-api.service';

@Module({
    imports: [HttpModule],
    controllers: [YarnsController],
    providers: [YarnsService, RavelryApiService],
})
export class YarnsModule { }
