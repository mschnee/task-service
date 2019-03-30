import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class CachedModel extends Entity {
    @property({
        type: 'string',
        id: true,
        required: true,
    })
    email: string;

    @property({
        type: 'string',
        required: true,
    })
    userId: string;

    // Define well-known properties here

    // Indexer property to allow additional data
    [prop: string]: any;

    constructor(data?: Partial<CachedModel>) {
        super(data);
    }
}
