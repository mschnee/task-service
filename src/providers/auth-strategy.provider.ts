import * as bcrypt from 'bcrypt';
import {Strategy} from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as JwtStrategy, ExtractJwt, VerifiedCallback} from 'passport-jwt';
import {Provider, inject, ValueOrPromise} from '@loopback/context';
import {AuthenticationBindings, AuthenticationMetadata, UserProfile} from '@loopback/authentication';
import {repository} from '@loopback/repository';

import {CachedUserModelRepository, UserRepository} from '../repositories';
import {User} from '../models';

export class AuthStrategyProvider implements Provider<Strategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA)
        private metadata: AuthenticationMetadata,
        @repository(CachedUserModelRepository)
        private cachedUserRepo: CachedUserModelRepository,
        @repository(UserRepository)
        private userRepo: UserRepository,
    ) {}

    value(): ValueOrPromise<Strategy | undefined> {
        // The function was not decorated, so we shouldn't attempt authentication
        if (!this.metadata) {
            return undefined;
        }

        const name = this.metadata.strategy;
        if (name === 'LocalStrategy') {
            return new LocalStrategy(
                {
                    usernameField: 'email',
                    passwordField: 'password',
                    passReqToCallback: true,
                },
                (req, email, password, cb) => this.verifyHttp(req, email, password, cb),
            );
        } else if (name === 'JwtStrategy') {
            return new JwtStrategy(
                {
                    secretOrKey: process.env.JWT_SECRET,
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                },
                (payload, cb) => this.verifyJwt(payload, cb),
            );
        } else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    async verifyHttp(req: any, email: string, password: string, done: (error: any, user?: any) => void) {
        const user = await this.userRepo.findOne({
            where: {
                email,
            },
        });

        if (user) {
            bcrypt.compare(password, user.password, done);
        } else {
            done(null, false);
        }
    }

    async verifyJwt(jwt_payload: any, done: VerifiedCallback) {
        const userId = jwt_payload.id;
        const cachedUser = await this.cachedUserRepo.get(userId);
        if (cachedUser) {
            done(null, cachedUser);
        } else {
            const user = await this.userRepo.findById(userId);
            if (user) {
                const tokenUserObject = new User.CachedModel({
                    id: user.id,
                    email: user.email,
                });
                await this.cachedUserRepo.set(userId, tokenUserObject, {
                    ttl: 5000,
                });
                done(null, tokenUserObject);
            } else {
                done(null, false);
            }
        }
    }
}
