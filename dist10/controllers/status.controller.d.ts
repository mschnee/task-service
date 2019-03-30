import { UserRepository } from '../repositories';
export declare class StatusController {
    userRepo: UserRepository;
    constructor(userRepo: UserRepository);
    getStatusV1(): Promise<any>;
    getStatus(): Promise<any>;
}
