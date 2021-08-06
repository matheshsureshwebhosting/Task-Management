import {Entity, model, property} from '@loopback/repository';

@model()
export class Projects extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: false,
  })
  projectid?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  clientid?: string[];

  constructor(data?: Partial<Projects>) {
    super(data);
  }
}

export interface ProjectsRelations {
  // describe navigational properties here
}

export type ProjectsWithRelations = Projects & ProjectsRelations;
