// Uncomment these imports to begin using these cool features!

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {get, post, requestBody, HttpErrors, param} from '@loopback/rest';
import {ParameterObject} from '@loopback/openapi-v3-types';

import {repository} from '@loopback/repository';

import {UserRepository, CachedUserModelRepository} from '../../repositories';
import {User} from '../../models';

const userSpec = {
    'application/json': {schema: {'x-ts-type': User.CachedModel}, example: new User.CachedModel({email: 'user@test.com', userId: '1a4'})},
};

const authSpec: ParameterObject = {
    name: 'Authorization',
    description: 'Authorization Bearer JWT token.',
    in: 'header',
    required: true,
    schema: {type: 'string'},
    example: 'Bearer aaaabbbbccccddddeee....zz',
};

export class V1UserController {
    constructor(
        @repository(UserRepository)
        private userRepo: UserRepository,
        @repository(CachedUserModelRepository)
        private cachedUserRepo: CachedUserModelRepository,
    ) {}

    @authenticate('JwtStrategy')
    @get('/v1/user/whoami', {
        responses: {
            '200': {
                description: "Responds with the user's email address",
                content: {'application/text': {schema: {type: 'string', example: 'user@test.com'}}},
            },
        },
    })
    async whoAmI(@inject(AuthenticationBindings.CURRENT_USER) user: User.CachedModel, @param(authSpec) auth: string): Promise<string> {
        return user.email;
    }

    @post('/v1/user/login', {
        responses: {
            '200': {
                description: 'User logged-in successfully',
                content: userSpec,
            },
            '401': {
                description: 'Failed to authenticate',
            },
        },
    })
    async login(@requestBody() login: User.LoginRequest): Promise<User.LoginResponse> {
        const userResult = await this.userRepo.find({
            where: {
                email: login.email,
            },
        });

        if (!userResult || userResult.length !== 1) {
            throw new HttpErrors.Forbidden();
        }
        const user = userResult[0];

        return new Promise((resolve, reject) => {
            try {
                bcrypt.compare(login.password, user.password, (bcryptErr, res) => {
                    if (bcryptErr) {
                        reject(bcryptErr);
                    } else {
                        if (!res) {
                            throw new HttpErrors.Forbidden();
                        }
                        jwt.sign(user.toObject(), process.env.JWT_SECRET || '', async (signError, token) => {
                            if (signError) {
                                reject(signError);
                            } else {
                                await this.cachedUserRepo.set(
                                    user.id,
                                    new User.CachedModel({
                                        userId: user.id,
                                        email: user.email,
                                    }),
                                    {
                                        ttl: 5000,
                                    },
                                );

                                resolve(
                                    new User.LoginResponse({
                                        token,
                                    }),
                                );
                            }
                        });
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    @post('/v1/user/create', {
        responses: {
            '200': {
                description: 'User created successfully',
                content: userSpec,
            },
            '409': {
                description: 'An account with that email already exists',
            },
        },
    })
    async create(
        @requestBody()
        login: User.LoginRequest,
    ): Promise<User.CachedModel> {
        const userResult = await this.userRepo.find({
            where: {
                email: login.email,
            },
        });

        if (userResult && userResult.length > 0) {
            throw new HttpErrors.Conflict('Account already exists');
        }
        return new Promise((resolve, reject) => {
            try {
                bcrypt.hash(login.password, 10, async (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        const user = new User.Model({
                            email: login.email,
                            password: hash,
                        });
                        const newUser = await this.userRepo.create(user);
                        resolve(
                            new User.CachedModel({
                                id: newUser.id,
                            }),
                        );
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}
