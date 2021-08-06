import {Entity, model, property} from '@loopback/repository';

@model()
export class Tasks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  taskid?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  status: string;

  @property({
    type: 'string',
    required: true,
  })
  projectid: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  clientid?: string[];

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  date: string;
  @property({
    type: 'string',
    required: true,
  })
  startdate: string;
  @property({
    type: 'string',
    required: true,
  })
  enddate: string;


  constructor(data?: Partial<Tasks>) {
    super(data);
  }
}

export interface TasksRelations {
  // describe navigational properties here
}

export type TasksWithRelations = Tasks & TasksRelations;
