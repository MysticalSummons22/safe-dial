import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ReportSpamDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  reason: string;
}