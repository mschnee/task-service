import {Entity, model, property} from '@loopback/repository';

@model()
export class UpdateTaskRequest extends Entity {
    @property({
        type: 'string',
        required: false,
    })
    public description: string;

    @property({
        type: 'date',
        required: false,
    })
    public dueDate: string;

    @property({
        type: 'string',
        required: true,
    })
    public name: string;

    @property({
        type: 'string',
        required: false,
        default: 'new',
    })
    public status: string;

    constructor(data?: Partial<UpdateTaskRequest>) {
        super(data);
    }
}

export const UpdateTaskSchema = {
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
