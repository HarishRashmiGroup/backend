import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async searchUsers(searchKey: string): Promise<User[]> {
    const results = await this.userRepository.find(
      {
        $or: [
          { id: isNaN(Number(searchKey)) ? null : Number(searchKey) },
          { name: { $ilike: `%${searchKey}%` } }, 
          { email: { $ilike: `%${searchKey}%` } }, 
        ],
      },
      { limit: 5, orderBy: { name: 'asc' } }, 
    );

    return results;
  }
}
