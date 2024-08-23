import { Controller, Post, Body, Get, UseGuards, Req, Param, NotFoundException } from '@nestjs/common';
import { ReportSpamService } from './report-spam.service';
import { AuthGuard } from '../auth/auth.guard';
import { ReportSpamDto } from './dto/create-report-spam.dto';
import { ReportSpam } from './entities/report-spam.entity';
import { UserService } from 'src/user/user.service';

@Controller('report-spam')
@UseGuards(AuthGuard)
export class ReportSpamController {
  constructor(
    private readonly reportSpamService: ReportSpamService,
    private readonly userService: UserService
  ) {}
  

  @Post()
  async reportMultipleSpam(
    @Body() reportSpamDtos: ReportSpamDto[],
    @Req() req
  ): Promise<{
    reported: ReportSpam[];
    notReported: { phoneNumber: string; reason: string }[];
  }> {
    // Fetch the full User entity using the user ID from JWT
    const user = await this.userService.findById(req.user.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Call the service to report multiple spam incidents
    const { reported, notReported } = await this.reportSpamService.reportMultipleSpam(reportSpamDtos, user);
    
    // Return the detailed result
    return {
      reported,
      notReported,
    };
  }

  @Get(':phoneNumber')
  async getReports(@Param('phoneNumber') phoneNumber: string): Promise<{
    phoneNumber: string;
    reportCount: number;
    reporters: { id: string; name: string }[];
  }> {
    return this.reportSpamService.findByPhoneNumber(phoneNumber);
  }
}