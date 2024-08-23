import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { User } from '../user/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ContactService {

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly userService: UserService,
  ) {}

  async createMultiple(createContactDtos: CreateContactDto[], user: User): Promise<Contact[]> {
    const contacts = createContactDtos?.map(dto => this.contactRepository.create({
      ...dto,
      user,
    }));

    const savedContacts = await this.contactRepository.save(contacts);
    return savedContacts;
  }

  async findAllByUser(userPayload: any): Promise<Contact[]> {
    // Fetch the full user entity using the user ID from the JWT payload
    const user = await this.userService.findById(userPayload.sub);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const contacts = await this.contactRepository.find({
      where: { user: { id: user.id } },
    });
    
    return contacts;
  }
}