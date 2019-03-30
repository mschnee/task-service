import {DefaultCrudRepository} from '@loopback/repository';
import {User} from '../models';
import {TaskDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserRepository extends DefaultCrudRepository<
  User.Model,
  typeof User.Model.prototype.id
> {
  constructor(@inject('datasources.task_db') dataSource: TaskDbDataSource) {
    super(User.Model, dataSource);
  }
}
