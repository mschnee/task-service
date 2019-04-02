import {Entity, model, property} from '@loopback/repository';

@model({
    name: 'User Model',
    settings: {
        hidden: ['password'],
    },
})
export class Model extends Entity {

    @property({
        type: 'string',
        id: false,
        required: true,
    })
    public email: string;
    @property({
        type: 'string',
        id: true,
        required: false,
    })
    public id: string;

    @property({
        type: 'string',
        required: true,
    })
    public password: string;

    constructor(data?: Partial<Model>) {
        super(data);
    }
}
