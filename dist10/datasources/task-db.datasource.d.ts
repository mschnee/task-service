import { juggler } from '@loopback/repository';
export declare class TaskDbDataSource extends juggler.DataSource {
    static dataSourceName: string;
    constructor(dsConfig?: object);
}
