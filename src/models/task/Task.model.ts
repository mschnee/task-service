import {Entity, model, property} from '@loopback/repository';
declare type TaskStatus = 'new' | 'complete';

@model({
    settings: {
        hidden: ['userId'],
    },
})
export class TaskModel extends Entity {
    @property({
        type: 'string',
    })
    public description?: string;

    @property({
        type: 'date',
        required: false,
    })
    public dueDate: string;

    @property({
        type: 'string',
        id: false,
        required: false,
    })
    public id?: string;

    @property({
        type: 'string',
        required: false,
    })
    public name: string;

    @property({
        type: 'string',
        required: false,
        default: 'new',
    })
    public status: TaskStatus;
    @property({
        type: 'string',
    })
    public userId: string;

    constructor(data?: Partial<TaskModel>) {
        super(data);
    }
}
