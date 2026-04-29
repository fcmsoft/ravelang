import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatternsController } from './patterns.controller';
import { PatternsService } from './patterns.service';
import { RavelryApiService } from '../common/ravelry-api.service';

@Module({
    imports: [HttpModule],
    controllers: [PatternsController],
    providers: [PatternsService, RavelryApiService],
})
export class PatternsModule { }
