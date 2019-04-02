import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {TaskDbDataSource} from '../datasources';
import {Task} from '../models';

export class TaskRepository extends DefaultCrudRepository<
    Task.TaskModel,
    typeof Task.TaskModel.prototype.id
> {
    constructor(@inject('datasources.task_db') dataSource: TaskDbDataSource) {
        super(Task.TaskModel, dataSource);
    }
}
