import {inject} from '@loopback/context';
import {get} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {UserRepository} from '../repositories';

export class StatusController {
  constructor(
    @inject('datasources.config.taskdb')
    public taskdb: any,
    @repository(UserRepository) public userRepo: UserRepository,
  ) {}

  @get('/status')
  public async getStatus(): Promise<any> {
    return {
      authdb_url: this.taskdb.url,
      userCount: await this.userRepo.count(),
    };
  }
}
