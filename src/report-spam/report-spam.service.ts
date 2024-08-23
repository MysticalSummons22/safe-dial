import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportSpam } from './entities/report-spam.entity';
import { User } from '../user/entities/user.entity';
import { ReportSpamDto } from './dto/create-report-spam.dto';

@Injectable()
export class ReportSpamService {
  constructor(
    @InjectRepository(ReportSpam)
    private readonly reportSpamRepository: Repository<ReportSpam>,
  ) {}

  async reportMultipleSpam(
    reportSpamDtos: ReportSpamDto[],
    reporter: User
  ): Promise<{
    reported: ReportSpam[];
    notReported: { phoneNumber: string; reason: string }[];
  }> {
    const reported: ReportSpam[] = [];
    const notReported: { phoneNumber: string; reason: string }[] = [];

    for (const dto of reportSpamDtos) {
      const existingReport = await this.reportSpamRepository.findOne({
        where: {
          reporter: { id: reporter.id },
          phoneNumber: dto.phoneNumber,
        },
      });

      if (!existingReport) {
        const report = this.reportSpamRepository.create({
          ...dto,
          reporter,
        });
        reported.push(report);
      } else {
        notReported.push({
          phoneNumber: dto.phoneNumber,
          reason: 'Already reported by this user',
        });
      }
    }

    if (reported.length > 0) {
      await this.reportSpamRepository.save(reported);
    }

    return {
      reported,
      notReported,
    };
  }

  async findByPhoneNumber(phoneNumber: string): Promise<{
    phoneNumber: string;
    reportCount: number;
    reporters: { id: string; name: string }[];
  }> {
    // Fetch all reports for the given phone number
    const reports = await this.reportSpamRepository.find({
      where: { phoneNumber },
      relations: ['reporter'], // Include the reporter relation to get user details
    });

    // Calculate the total number of reports
    const reportCount = reports.length;

    // Extract the list of reporters (minimal information)
    const reporters = reports.map(report => ({
      id: report.reporter.id,
      name: report.reporter.name,
    }));

    return {
      phoneNumber,
      reportCount,
      reporters,
    };
  }
}