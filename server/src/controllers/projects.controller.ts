import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {Uuid} from '../helpers/uuid';
import {Projects} from '../models';
import {ProjectsRepository} from '../repositories';

interface Projectsclient {
  clientid: string
}

export class ProjectsController {
  constructor(
    @repository(ProjectsRepository)
    public projectsRepository: ProjectsRepository,
    @inject('uuid')
    public uuid: Uuid,
  ) { }

  @post('/projects')
  @response(200, {
    description: 'Projects model instance',
    content: {'application/json': {schema: getModelSchemaRef(Projects)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {
            title: 'NewProjects',
            exclude: ['id'],
          }),
        },
      },
    })
    projects: Omit<Projects, 'id'>,
  ): Promise<Projects> {
    const newProjectid = await this.uuid.createUUID()
    projects.projectid = newProjectid
    return this.projectsRepository.create(projects);
  }

  @get('/projects/count')
  @response(200, {
    description: 'Projects model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Projects) where?: Where<Projects>,
  ): Promise<Count> {
    return this.projectsRepository.count(where);
  }

  @get('/projects')
  @response(200, {
    description: 'Array of Projects model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Projects, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Projects) filter?: Filter<Projects>,
  ): Promise<Projects[]> {
    return this.projectsRepository.find(filter);
  }

  @patch('/projects')
  @response(200, {
    description: 'Projects PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {partial: true}),
        },
      },
    })
    projects: Projects,
    @param.where(Projects) where?: Where<Projects>,
  ): Promise<Count> {
    return this.projectsRepository.updateAll(projects, where);
  }

  @get('/projects/{id}')
  @response(200, {
    description: 'Projects model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Projects, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Projects, {exclude: 'where'}) filter?: FilterExcludingWhere<Projects>
  ): Promise<Projects> {
    return this.projectsRepository.findById(id, filter);
  }

  @patch('/projects/{id}')
  @response(204, {
    description: 'Projects PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Projects, {partial: true}),
        },
      },
    })
    projects: Projects,
  ): Promise<void> {
    await this.projectsRepository.updateById(id, projects);
  }

  @put('/projects/{id}')
  @response(204, {
    description: 'Projects PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() projects: Projects,
  ): Promise<void> {
    await this.projectsRepository.replaceById(id, projects);
  }

  @del('/projects/{id}')
  @response(204, {
    description: 'Projects DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.projectsRepository.deleteById(id);
  }

  //updateclientid in Project
  @post('/project/updateclientid/{id}')
  @response(200, {
    description: 'clieniid Updated',
    content: {'application/json': {schema: getModelSchemaRef(Projects, {includeRelations: true})}},
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
    }) project: Projectsclient) {
    const projectData = await this.projectsRepository.findById(id)
    const updatedclientid = projectData.clientid
    const newclientid: string = project.clientid
    updatedclientid?.push(newclientid)
    projectData.clientid = updatedclientid
    await this.projectsRepository.updateById(id, projectData);
    return projectData
  }
  //remove Clientid in task
  @post('/project/removeclientid/{id}')
  @response(200, {
    description: 'Client Id Removed',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          items: getModelSchemaRef(Projects, {includeRelations: true}),
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
    }) project: Projectsclient) {
    const singleProject: Projects = await this.projectsRepository.findById(id)
    const clientids: string[] | undefined = singleProject.clientid
    const findindex = Number(clientids?.indexOf(project.clientid))
    const removeclientid: string[] | undefined = clientids?.splice(findindex, 1)
    console.log(removeclientid)
    singleProject.clientid = clientids
    const saveProject = await this.projectsRepository.updateById(id, singleProject)
    console.log(saveProject)
    return singleProject
  }

}


