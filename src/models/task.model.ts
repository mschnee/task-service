import {Entity, model, property} from '@loopback/repository';

enum TaskStatus {
    NEW = 'new',
    COMPLETE = 'complete',
}
@model()
export class TaskModel extends Entity {
    @property({
        type: 'string',
        required: true,
    })
    name: string;

    @property({
        type: 'string',
    })
    description?: string;

    @property({
        type: 'date',
        required: true,
    })
    dueDate: string;

    @property({
        type: 'enum',
        required: true,
        default: TaskStatus.NEW,
    })
    status: TaskStatus;

    @property({
        type: 'string',
        id: true,
        required: true,
    })
    id: string;

    constructor(data?: Partial<TaskModel>) {
        super(data);
    }
}
