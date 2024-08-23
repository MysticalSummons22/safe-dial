import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ReportSpam } from '../report-spam/entities/report-spam.entity';
import { Contact } from 'src/contact/entities/contact.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ReportSpam)
    private readonly reportSpamRepository: Repository<ReportSpam>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async searchByName(name: string): Promise<any[]> {
    const resultsStartWithInUsers = await this.userRepository.find({
      where: { name: ILike(`${name}%`) },
    });

    const resultsContainInUser = await this.userRepository.find({
      where: { name: ILike(`%${name}%`) },
    });

    const filteredResultsContainInUser = resultsContainInUser.filter(
      user => !resultsStartWithInUsers.some(startWithUser => startWithUser.id === user.id)
    );

    const resultsStartWithInContacts = await this.contactRepository.find({
      where: { name: ILike(`${name}%`) },
    });

    const resultsContainInContacts = await this.contactRepository.find({
      where: { name: ILike(`%${name}%`) },
    });

    const filteredResultsContainInContacts = resultsContainInContacts.filter(
      contact => !resultsStartWithInContacts.some(startWithContact => startWithContact.id === contact.id)
    );

    // Combine the results
    const results = [...resultsStartWithInUsers, ...filteredResultsContainInUser, ...resultsStartWithInContacts, ...filteredResultsContainInContacts];

    // Map the results to include spam likelihood
    return Promise.all(results.map(async user => ({
      name: user.name,
      phoneNumber: user.phoneNumber,
      spamLikelihood: await this.calculateSpamLikelihood(user.phoneNumber),
    })));
}

  async searchByPhoneNumber(phoneNumber: string): Promise<any[]> {
    // Search for a registered user with this phone number
    const registeredUser = await this.userRepository.findOne({
      where: { phoneNumber },
    });

    const results = [];

    if (registeredUser) {
      results.push({
        name: registeredUser.name,
        phoneNumber: registeredUser.phoneNumber,
        spamLikelihood: await this.calculateSpamLikelihood(phoneNumber),
        type: 'Registered User', // Indicate that this is a registered user
      });
    }

    // If no registered user, or even if found, search for all contacts with this phone number
    const contacts = await this.contactRepository.find({
      where: { phoneNumber },
    });

    if (contacts.length > 0) {
      const contactResults = await Promise.all(contacts.map(async contact => ({
        name: contact.name,
        phoneNumber: contact.phoneNumber,
        spamLikelihood: await this.calculateSpamLikelihood(contact.phoneNumber),
        type: 'Contact', // Indicate that this is a contact
      })));
      results.push(...contactResults);
    }

    // If no contact found, return spam reports
    const spamReports = await this.reportSpamRepository.find({
      where: { phoneNumber },
    });

    if (spamReports.length > 0) {
      const spamReportResults = await Promise.all(spamReports.map(async report => ({
        name: 'Unknown', // For spam reports, the name might be unknown
        phoneNumber: report.phoneNumber,
        spamLikelihood: await this.calculateSpamLikelihood(report.phoneNumber),
        type: 'Reported Spam', // Indicate that this is just a reported spam
      })));
      results.push(...spamReportResults);
    }

    // Remove duplicates by both name and phoneNumber
    const uniqueResults = results.reduce((acc, current) => {
      const existing = acc.find(item => item.phoneNumber === current.phoneNumber && item.name === current.name);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Return the unique results
    return uniqueResults;
  }

  private async calculateSpamLikelihood(phoneNumber: string): Promise<number> {
    const spamReportsCount = await this.reportSpamRepository.count({ where: { phoneNumber } });
    const likelihood = Math.min(spamReportsCount / 100, 1); // Example: 1 report = 1% likelihood
    return likelihood;
  }
}