import {Entity, model, property} from '@loopback/repository';
declare type TaskStatus = 'new' | 'complete';

@model()
export class UpsertTaskResponse extends Entity {
    @property({
        type: 'string',
        id: true,
        required: true,
    })
    public id?: string;

    constructor(data?: Partial<UpsertTaskResponse>) {
        super(data);
    }
}
