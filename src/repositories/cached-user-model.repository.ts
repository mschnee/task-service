import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import {User} from '../models';
import {RedisDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CachedUserModelRepository extends DefaultKeyValueRepository<
  User.CachedModel
> {
  constructor(@inject('datasources.redis') dataSource: RedisDataSource) {
    super(User.CachedModel, dataSource);
  }
}
