import {DefaultCrudRepository} from '@loopback/repository';
import {TaskModel} from '../models';
import {TaskDbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TaskRepository extends DefaultCrudRepository<
  TaskModel,
  typeof TaskModel.prototype.status
> {
  constructor(@inject('datasources.task_db') dataSource: TaskDbDataSource) {
    super(TaskModel, dataSource);
  }
}
