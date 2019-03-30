import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

export class TaskdbDataSource extends juggler.DataSource {
  static dataSourceName = 'taskbd';

  constructor(
    @inject('datasources.config.taskdb', {optional: true})
    dsConfig: object,
  ) {
    console.log('setting up task_db connection with', dsConfig);
    super(dsConfig);
  }
}
