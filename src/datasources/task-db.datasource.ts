import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './task-db.datasource.json';

export class TaskDbDataSource extends juggler.DataSource {
    static dataSourceName = 'task_db';

    constructor(
        @inject('datasources.config.task_db', {optional: true})
        dsConfig: object = config,
    ) {
        super(dsConfig);
    }
}
