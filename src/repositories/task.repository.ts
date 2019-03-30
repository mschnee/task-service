import {DefaultCrudRepository} from '@loopback/repository';
import {Task} from '../models';
import {TaskdbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.status
> {
  constructor(
    @inject('datasources.taskdb') dataSource: TaskdbDataSource,
  ) {
    super(Task, dataSource);
  }
}
