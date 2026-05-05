import { Injectable } from '@nestjs/common';
import { RavelryApiService } from '../common/ravelry-api.service';

@Injectable()
export class DesignersService {
  constructor(private readonly ravelryApi: RavelryApiService) {}

  async getDesigner(id: string) {
    return this.ravelryApi.get(`/designers/${id}.json?include=featured_bundles`);
  }
}
