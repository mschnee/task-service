import { Entity } from '@loopback/repository';
export declare class Task extends Entity {
    name: string;
    description?: string;
    dueDate: string;
    status: string;
    id: string;
    constructor(data?: Partial<Task>);
}
