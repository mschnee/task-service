import {Entity, model, property} from '@loopback/repository';
declare type TaskStatus = 'new' | 'complete';

@model()
export class CreateTaskRequest extends Entity {
    @property({
        type: 'string',
        required: true,
    })
    public description: string;

    @property({
        type: 'date',
        required: true,
    })
    public dueDate: string;

    @property({
        type: 'string',
        required: true,
    })
    public name: string;

    @property({
        type: 'string',
        required: true,
        default: 'new',
    })
    public status: string;

    constructor(data?: Partial<CreateTaskRequest>) {
        super(data);
    }
}

export const CreateTaskSchema = {
    content: {
        'application/json': {
            type: 'object',
            properties: {
                name: {type: 'string'},
                description: {type: 'string'},
                dueDate: {type: 'date'},
                status: {type: 'string', enum: ['new', 'completed']},
            },
        },
    },
};
