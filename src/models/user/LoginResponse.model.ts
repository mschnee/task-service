import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class LoginResponse extends Model {
    @property({
        type: 'string',
        required: true,
    })
    token: string;

    constructor(data?: Partial<LoginResponse>) {
        super(data);
    }
}
