import { Controller, Get, Param, Query } from '@nestjs/common';
import { YarnsService } from './yarns.service';

@Controller('yarns')
export class YarnsController {
    constructor(private readonly yarnsService: YarnsService) { }

    @Get()
    async listYarns(
        @Query('page') page?: number,
        @Query('page_size') pageSize?: number,
    ) {
        return this.yarnsService.listYarns(page, pageSize);
    }

    @Get('search')
    async searchYarns(@Query('q') query: string, @Query('page') page?: number) {
        return this.yarnsService.searchYarns(query, page);
    }

    @Get('weights')
    async getYarnWeights() {
        return this.yarnsService.getYarnWeights();
    }

    @Get(':id')
    async getYarn(@Param('id') id: string) {
        return this.yarnsService.getYarn(id);
    }
}
