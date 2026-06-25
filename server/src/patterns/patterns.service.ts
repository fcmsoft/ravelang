import { Injectable } from '@nestjs/common';
import { RavelryApiService } from '../common/ravelry-api.service';

@Injectable()
export class PatternsService {
    constructor(private readonly ravelryApi: RavelryApiService) { }

    async listPatterns(page: number = 1, pageSize: number = 20) {
        return this.ravelryApi.get('/patterns/search.json', {
            page,
            page_size: pageSize,
            sort: 'recently-popular',
        });
    }

    async searchPatterns(query: string, page: number = 1, sort?: string) {
        return this.ravelryApi.get('/patterns/search.json', {
            query,
            page,
            page_size: 20,
            ...(sort && { sort }),
        });
    }

    async getPattern(id: string) {
        return this.ravelryApi.get(`/patterns/${id}.json`);
    }

    async getFavoritePatterns(username: string, accessToken: string) {
        return this.ravelryApi.get(`/people/${username}/favorites/list.json`, {
            types: 'pattern',
        }, accessToken);
    }
}
