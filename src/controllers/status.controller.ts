import {inject} from '@loopback/context';
import {get} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {UserRepository} from '../repositories';

export class StatusController {
  constructor(@repository(UserRepository) public userRepo: UserRepository) {}

  @get('/v1/status')
  public async getStatusV1(): Promise<any> {
    return {
      userCount: (await this.userRepo.count()).count,
      task_db: this.userRepo.dataSource.settings,
    };
  }

  @get('/status')
  public async getStatus() {
    return this.getStatusV1();
  }
}
