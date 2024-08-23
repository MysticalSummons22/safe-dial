import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { AuthModule } from '../auth/auth.module'; // Adjusted import path to be consistent
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    AuthModule,
    UserModule
  ],
  providers: [ContactService],
  controllers: [ContactController],
  exports: [ContactService], // Exporting ContactService for potential use in other modules
})
export class ContactModule {}