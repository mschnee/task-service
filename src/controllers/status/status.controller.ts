import {inject} from '@loopback/context';
import {get} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {UserRepository} from '../../repositories';
import {RedisDataSource, TaskDbDataSource} from '../../datasources';

export class StatusController {
    constructor(
        @repository(UserRepository) public userRepo: UserRepository,
        @inject('datasources.redis') public cacheDb: RedisDataSource,
        @inject('datasources.task_db') public taskDb: TaskDbDataSource,
    ) {}

    @get('/v1/status')
    public async getStatusV1(): Promise<any> {
        return {
            userCount: (await this.userRepo.count()).count,
            task_db: statusFromMongoTopology((this.taskDb.connector as any).client.topology),
            cacheDb: (this.cacheDb.connector as any)._client.serverInfo,
        };
    }

    @get('/status')
    public async getStatus() {
        return this.getStatusV1();
    }
}

function statusFromMongoTopology(t: any) {
    return {
        host: t.host,
        port: t.port,
        poolSise: t.poolSize,
    };
}
