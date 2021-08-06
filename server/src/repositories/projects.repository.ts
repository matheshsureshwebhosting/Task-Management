import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Projects, ProjectsRelations} from '../models';

export class ProjectsRepository extends DefaultCrudRepository<
  Projects,
  typeof Projects.prototype.id,
  ProjectsRelations
> {
  constructor(
    @inject('datasources.mongoDB') dataSource: MongoDbDataSource,
  ) {
    super(Projects, dataSource);
  }
}
