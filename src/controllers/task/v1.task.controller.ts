import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {Count, CountSchema, DeepPartial, Filter, repository, Where} from '@loopback/repository';
import {
    del,
    get,
    getFilterSchemaFor,
    getWhereSchemaFor,
    HttpErrors,
    param,
    patch,
    post,
    put,
    requestBody,
    RequestBodyObject,
} from '@loopback/rest';
import {Task, User} from '../../models';
import {TaskRepository} from '../../repositories';

export class V1TaskControllerController {
    constructor(
        @repository(TaskRepository)
        public taskRepository: TaskRepository,
    ) {}

    @authenticate('JwtStrategy')
    @get('/v1/task/count', {
        responses: {
            '200': {
                description: 'Task model count',
                content: {'application/json': {schema: CountSchema}},
            },
        },
    })
    public async count(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
    ): Promise<Count> {
        return await this.taskRepository.count({
            userId: user.id,
        });
    }

    @authenticate('JwtStrategy')
    @post('/v1/task', {
        responses: {
            '200': {
                description: 'Task model instance',
                content: {'application/json': {schema: {'x-ts-type': Task.UpsertTaskResponse}}},
            },
        },
    })
    public async create(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @requestBody(Task.CreateTaskSchema) taskRequest: Task.CreateTaskRequest,
    ): Promise<Task.UpsertTaskResponse> {
        const task = new Task.TaskModel({
            userId: user.id,
            name: taskRequest.name,
            description: taskRequest.description,
            dueDate: taskRequest.dueDate,
            status: 'new',
        });
        return await this.taskRepository.create(task);
    }

    @authenticate('JwtStrategy')
    @del('/v1/task/{id}', {
        responses: {
            '204': {
                description: 'Task DELETE success',
            },
        },
    })
    public async deleteById(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @param.path.string('id') id: string,
    ): Promise<void> {
        const task = await this.taskRepository.findById(id);
        if (task.userId !== user.id) {
            throw new HttpErrors.Forbidden();
        } else {
            await this.taskRepository.deleteById(id);
        }
    }

    @authenticate('JwtStrategy')
    @get('/v1/task', {
        responses: {
            '200': {
                description: 'Array of Task model instances',
                content: {
                    'application/json': {
                        schema: {type: 'array', items: {'x-ts-type': Task.TaskModel}},
                    },
                },
            },
        },
    })
    public async find(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @param.query.object('filter', getFilterSchemaFor(Task.TaskModel)) filter?: Filter,
    ): Promise<Task.TaskModel[]> {
        const task = await this.taskRepository.find(filter);
        return task.filter((t: Task.TaskModel) => t.userId === user.id);
    }

    @authenticate('JwtStrategy')
    @get('/v1/task/{id}', {
        responses: {
            '200': {
                description: 'Task model instance',
                content: {'application/json': {schema: {'x-ts-type': Task.TaskModel}}},
            },
        },
    })
    public async findById(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @param.path.string('id') id: string,
    ): Promise<Task.TaskModel> {
        const task = await this.taskRepository.findById(id);
        if (task.userId !== user.id) {
            throw new HttpErrors.Forbidden();
        } else {
            return task;
        }
    }

    @authenticate('JwtStrategy')
    @put('/v1/task/{id}', {
        responses: {
            '204': {
                description: 'Task PUT success',
            },
        },
    })
    public async replaceById(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @param.path.string('id') id: string,
        @requestBody(Task.UpdateTaskSchema) taskRequest: Task.CreateTaskRequest,
    ): Promise<void> {
        const task = await this.taskRepository.findById(id);
        if (task.userId !== user.id) {
            throw new HttpErrors.Forbidden();
        } else {
            const replace = new Task.TaskModel({
                userId: user.id,
                name: taskRequest.name || task.name,
                description: taskRequest.description || task.description,
                dueDate: taskRequest.dueDate || task.dueDate,
            });
            await this.taskRepository.replaceById(id, replace);
        }
    }

    @authenticate('JwtStrategy')
    @patch('/v1/task/{id}', {
        responses: {
            '204': {
                description: 'Task PATCH success',
            },
        },
    })
    public async updateById(
        @inject(AuthenticationBindings.CURRENT_USER) user: User.Model,
        @param.path.string('id') id: string,
        @requestBody(Task.UpdateTaskSchema) taskRequest: Task.UpdateTaskRequest,
    ): Promise<void> {
        const task = await this.taskRepository.findById(id);
        if (task.userId !== user.id) {
            throw new HttpErrors.Forbidden();
        } else {
            await this.taskRepository.updateById(id, taskRequest.toObject());
        }
    }
}
