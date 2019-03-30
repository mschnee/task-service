import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models';
import {TaskdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  constructor(@inject('datasources.taskdb') dataSource: TaskdbDataSource) {
    super(User, dataSource);
  }
}
