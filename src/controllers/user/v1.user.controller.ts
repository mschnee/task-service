// Uncomment these imports to begin using these cool features!

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings, authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {get, post, requestBody, HttpErrors} from '@loopback/rest';

import {repository} from '@loopback/repository';

import {UserRepository, CachedUserModelRepository} from '../../repositories';
import {User} from '../../models';

export class V1UserController {
    constructor(
        @repository(UserRepository)
        private userRepo: UserRepository,
        @repository(CachedUserModelRepository)
        private cachedUserRepo: CachedUserModelRepository,
    ) {}

    @authenticate('JwtStrategy')
    @get('/v1/user/whoami')
    async whoAmI(@inject(AuthenticationBindings.CURRENT_USER) user: User.CachedModel): Promise<User.CachedModel> {
        return user.getId();
    }

    @post('/v1/user/login')
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
                bcrypt.compare(login.password, user.password, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!res) {
                            throw new HttpErrors.Forbidden();
                        }
                        jwt.sign(user.toObject(), process.env.JWT_SECRET || '', async (err, token) => {
                            if (err) {
                                reject(err);
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

    @post('/v1/user/create')
    async create(
        @requestBody({
            description: 'Login Request Body',
            required: true,
            content: {
                'application/json': {
                    schema: {type: 'object'},
                },
            },
        })
        login: User.LoginRequest,
    ): Promise<User.CachedModel> {
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
