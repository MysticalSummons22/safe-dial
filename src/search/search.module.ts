import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ReportSpam } from '../report-spam/entities/report-spam.entity';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Contact } from 'src/contact/entities/contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User,Contact, ReportSpam]),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}