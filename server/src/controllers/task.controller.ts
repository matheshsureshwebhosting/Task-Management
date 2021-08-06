import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {Uuid} from '../helpers/uuid';
import {Tasks} from '../models';
import {TasksRepository} from '../repositories';

interface Taskclientid {
  clientid: string
}
interface Status {
  status: string
}
export class TaskController {
  constructor(
    @repository(TasksRepository)
    public tasksRepository: TasksRepository,
    @inject('uuid')
    public uuid: Uuid,
  ) { }

  //create new Task
  @post('/tasks')
  @response(200, {
    description: 'Tasks model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tasks)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tasks, {
            title: 'NewTasks',
            exclude: ['id'],
          }),
        },
      },
    })
    tasks: Omit<Tasks, 'id'>,
  ): Promise<Tasks> {
    const newTaskid = await this.uuid.createUUID()
    tasks.taskid = newTaskid
    return this.tasksRepository.create(tasks);
  }

  //get all task

  @get('/tasks')
  @response(200, {
    description: 'Array of Tasks model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tasks, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tasks) filter?: Filter<Tasks>,
  ): Promise<Tasks[]> {
    return this.tasksRepository.find(filter);
  }

  //get specific task
  @get('/tasks/{id}')
  @response(200, {
    description: 'Tasks model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tasks, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tasks, {exclude: 'where'}) filter?: FilterExcludingWhere<Tasks>
  ): Promise<Tasks> {
    return this.tasksRepository.findById(id, filter);
  }

  //updateclientid in task
  @post('/task/updateclientid/{id}')
  @response(200, {
    description: 'clieniid Updated',
    content: {'application/json': {schema: getModelSchemaRef(Tasks, {includeRelations: true})}},
  })
  async updateByClientId(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              clientid: {
                type: "string"
              }
            }
          },
        },
      },
    }) tasks: Taskclientid) {
    const taskData = await this.tasksRepository.findById(id)
    const updatedclientid = taskData.clientid
    const newclientid: string = tasks.clientid
    updatedclientid?.push(newclientid)
    taskData.clientid = updatedclientid
    return this.tasksRepository.updateById(id, taskData);
  }
  //get specific projectid in task
  @get('/task/project/{projectid}')
  @response(200, {
    description: 'Specific Projects',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tasks, {includeRelations: true}),
        },
      },
    },
  })
  async projectId(@param.path.string('projectid') projectid: string) {
    const allTask = await this.tasksRepository.find()
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const singleProjectTasks = await allTask.filter((task) => {return task.projectid === projectid})
    return singleProjectTasks
  }

  //remove Clientid in task
  @post('/task/removeclientid/{id}')
  @response(200, {
    description: 'Client Id Removed',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: getModelSchemaRef(Tasks, {includeRelations: true}),
        },
      },
    },
  })
  async removeClientId(@param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              clientid: {
                type: "string"
              }
            }
          },
        },
      },
    }) tasks: Taskclientid) {
    console.log(id, tasks.clientid)
    const singleTask: Tasks = await this.tasksRepository.findById(id)
    const clientids: string[] | undefined = singleTask.clientid
    const findindex = Number(clientids?.indexOf(tasks.clientid))
    const removeclientid: string[] | undefined = clientids?.splice(findindex, 1)
    console.log(removeclientid)
    singleTask.clientid = clientids
    const saveTask = await this.tasksRepository.updateById(id, singleTask)
    console.log(saveTask)
    return singleTask
  }

  //updateclientid in task
  @post('/task/updatestatus/{id}')
  @response(200, {
    description: 'Status Updated',
    content: {'application/json': {schema: getModelSchemaRef(Tasks, {includeRelations: true})}},
  })
  async updateStatus(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "string"
              }
            }
          },
        },
      },
    }) tasks: Status) {
    const taskData = await this.tasksRepository.findById(id)
    taskData["status"] = tasks.status
    return this.tasksRepository.updateById(id, taskData);
  }


  //update or replace data

  @put('/tasks/{id}')
  @response(204, {
    description: 'Tasks PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() tasks: Tasks,
  ): Promise<void> {
    await this.tasksRepository.replaceById(id, tasks);
  }

  @del('/tasks/{id}')
  @response(204, {
    description: 'Tasks DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tasksRepository.deleteById(id);
  }
}
