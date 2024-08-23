import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportSpamService } from './report-spam.service';
import { ReportSpamController } from './report-spam.controller';
import { ReportSpam } from './entities/report-spam.entity';
import { AuthModule } from '../auth/auth.module'; 
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportSpam]),
    AuthModule,
    UserModule
  ],
  providers: [ReportSpamService],
  controllers: [ReportSpamController],
})
export class ReportSpamModule {}