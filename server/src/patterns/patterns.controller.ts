import { Controller, Get, Param, Query } from '@nestjs/common';
import { PatternsService } from './patterns.service';

@Controller('patterns')
export class PatternsController {
    constructor(private readonly patternsService: PatternsService) { }

    @Get()
    async listPatterns(
        @Query('page') page?: number,
        @Query('page_size') pageSize?: number,
    ) {
        return this.patternsService.listPatterns(page, pageSize);
    }

    @Get('search')
    async searchPatterns(@Query('q') query: string, @Query('page') page?: number) {
        return this.patternsService.searchPatterns(query, page);
    }

    @Get(':id')
    async getPattern(@Param('id') id: string) {
        return this.patternsService.getPattern(id);
    }
}
