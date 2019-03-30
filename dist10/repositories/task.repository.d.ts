import { DefaultCrudRepository } from '@loopback/repository';
import { Task } from '../models';
import { TaskDbDataSource } from '../datasources';
export declare class TaskRepository extends DefaultCrudRepository<Task, typeof Task.prototype.status> {
    constructor(dataSource: TaskDbDataSource);
}
