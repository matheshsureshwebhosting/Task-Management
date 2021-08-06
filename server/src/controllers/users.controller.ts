import { inject } from '@loopback/core';
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
import { Hasher } from '../helpers/bcrypt';
import { JwtToken } from '../helpers/jwt';
import { Users } from '../models';
import { UsersRepository } from '../repositories';

interface Userlogin {
  email: string,
  password: string
}

export class UsersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject('hasher')
    public hasher: Hasher,
    @inject('jwtToken')
    public jwtToken: JwtToken
  ) { }

  @post('/users')
  @response(200, {
    description: 'Users model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Users) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    users: Omit<Users, 'id'>,
  ): Promise<Users> {
    const hashpwd = await this.hasher.createHash(users.password)
    users.password = hashpwd
    const newclientid: string = Date.now().toString()
    const newToken: string = await this.jwtToken.createToken(newclientid)
    users.clientid = newclientid
    users.token = newToken
    return this.usersRepository.create(users);
  }

  @get('/users/count')
  @response(200, {
    description: 'Users model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Users, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Users) filter?: Filter<Users>,
  ): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'Users PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>,
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'Users model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Users, { exclude: 'where' }) filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'Users PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'Users PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() users: Users,
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'Users DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }


  //updateclientid in task
  @post('/users/login/')
  @response(200, {
    description: 'User Created',
    content: { 'application/json': { schema: getModelSchemaRef(Users, { includeRelations: true }) } },
  })
  async updateByClientId(    
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string"
              },
              password: {
                type: "string"
              }
            }
          },
        },
      },
    }) user: Userlogin) {    
    const userData = await this.usersRepository.find()
    const filterUser=await userData.filter((dbuser)=>{return dbuser.email===user.email})
    if(filterUser.length===0) return false
    const verifypwd=await this.hasher.verifyHash(user.password,filterUser[0].password)
    if(verifypwd===false) return false
    return filterUser[0].clientid    
  }

}
