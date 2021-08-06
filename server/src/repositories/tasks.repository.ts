import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Tasks, TasksRelations} from '../models';

export class TasksRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.id,
  TasksRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Tasks, dataSource);
  }
}
