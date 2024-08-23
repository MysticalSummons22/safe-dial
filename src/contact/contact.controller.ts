import { Controller, Post, Body, Get, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from '../user/user.service';
import { Contact } from './entities/contact.entity';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly userService: UserService,
  ) {}

  @Post()
  async createMultipleContacts(@Body() createContactDtos: CreateContactDto[], @Req() req): Promise<Contact[]> {
    // Fetch the full User entity using the user ID from JWT
    const user = await this.userService.findById(req.user.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Pass the User entity to createMultiple
    const contacts = await this.contactService.createMultiple(createContactDtos, user);
    return contacts;
  }

  @Get()
  async getContacts(@Req() req): Promise<Contact[]> {
    const contacts = await this.contactService.findAllByUser(req.user);
    return contacts;
  }
}