import {Entity, model, property} from '@loopback/repository';

@model()
export class Model extends Entity {
    @property({
        type: 'string',
        id: true,
        required: false,
    })
    id: string;

    @property({
        type: 'string',
        id: false,
        required: true,
    })
    email: string;

    @property({
        type: 'string',
        required: true,
    })
    password: string;

    constructor(data?: Partial<Model>) {
        super(data);
    }
}
