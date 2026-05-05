import { Controller, Get, Param, Query } from '@nestjs/common';
import { DesignersService } from './designers.service';

@Controller('designers')
export class DesignersController {
  constructor(private readonly designersService: DesignersService) {}

  @Get(':id')
  async getDesigner(@Param('id') id: string) {
    return this.designersService.getDesigner(id);
  }
}
