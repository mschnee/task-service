import {inject} from '@loopback/core';
import {DefaultKeyValueRepository} from '@loopback/repository';
import {RedisDataSource} from '../datasources';
import {User} from '../models';

export class CachedUserModelRepository extends DefaultKeyValueRepository<User.Model> {
    constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
        super(User.Model, dataSource);
    }
}
