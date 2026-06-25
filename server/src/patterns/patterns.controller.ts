import { Controller, Get, Param, Query, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { PatternsService } from './patterns.service';

@Controller('patterns')
export class PatternsController {
    constructor(private readonly patternsService: PatternsService) { }

    @Get('favorites')
    async getFavoritePatterns(@Req() req: Request) {
        if (!req.session?.user || !req.session?.accessToken) {
            throw new UnauthorizedException();
        }
        return this.patternsService.getFavoritePatterns(req.session.user.username, req.session.accessToken);
    }

    @Get()
    async listPatterns(
        @Query('page') page?: number,
        @Query('page_size') pageSize?: number,
    ) {
        return this.patternsService.listPatterns(page, pageSize);
    }

    @Get('search')
    async searchPatterns(
        @Query('q') query: string,
        @Query('page') page?: number,
        @Query('sort') sort?: string,
    ) {
        return this.patternsService.searchPatterns(query, page, sort);
    }

    @Get(':id')
    async getPattern(@Param('id') id: string) {
        return this.patternsService.getPattern(id);
    }
}
