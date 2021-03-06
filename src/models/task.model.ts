import {Entity, model, property} from '@loopback/repository';

declare type TaskStatus = 'new' | 'complete';
@model()
export class TaskModel extends Entity {

    @property({
        type: 'string',
    })
    public description?: string;

    @property({
        type: 'date',
        required: true,
    })
    public dueDate: string;

    @property({
        type: 'string',
        id: true,
        required: true,
    })
    public id: string;
    @property({
        type: 'string',
        required: true,
    })
    public name: string;

    @property({
        type: 'enum',
        required: true,
        default: 'new',
    })
    public status: TaskStatus;

    constructor(data?: Partial<TaskModel>) {
        super(data);
    }
}
