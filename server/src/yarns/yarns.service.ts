import { Injectable } from '@nestjs/common';
import { RavelryApiService } from '../common/ravelry-api.service';

@Injectable()
export class YarnsService {
    constructor(private readonly ravelryApi: RavelryApiService) { }

    async listYarns(page: number = 1, pageSize: number = 20) {
        return this.ravelryApi.get('/yarns/search.json', {
            page,
            page_size: pageSize,
            sort: 'best',
        });
    }

    async searchYarns(query: string, page: number = 1) {
        return this.ravelryApi.get('/yarns/search.json', {
            query,
            page,
            page_size: 20,
        });
    }

    async getYarn(id: string) {
        return this.ravelryApi.get(`/yarns/${id}.json`);
    }
}
