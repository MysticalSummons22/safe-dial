import { Controller, Get, Query, Param, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('search')
@UseGuards(AuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('name')
  async searchByName(@Query('name') name: string): Promise<any[]> {
    return this.searchService.searchByName(name);
  }

  @Get('phone')
  async searchByPhoneNumber(@Query('phoneNumber') phoneNumber: string): Promise<any[]> {
    return this.searchService.searchByPhoneNumber(phoneNumber);
  }
}