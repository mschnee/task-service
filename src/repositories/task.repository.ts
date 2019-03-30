import {DefaultCrudRepository} from '@loopback/repository';
import {Task} from '../models';
import {TaskDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TaskRepository extends DefaultCrudRepository<
  Task,
  typeof Task.prototype.status
> {
  constructor(@inject('datasources.task_db') dataSource: TaskDbDataSource) {
    super(Task, dataSource);
  }
}
