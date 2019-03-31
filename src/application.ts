import * as path from 'path';

import {AuthenticationComponent, AuthenticationBindings} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';

import {MySequence} from './sequence';
import {AuthStrategyProvider} from './providers';
import setupEnvironment from './lib/setup-environment';

export class TaskServiceApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
    constructor(options: ApplicationConfig = {}) {
        super(options);

        /**
         * Set up environment variables here
         */
        setupEnvironment(this);

        // Set up the custom sequence
        this.sequence(MySequence);

        // Set up default home page
        this.static('/', path.join(__dirname, '../public'));

        // Customize @loopback/rest-explorer configuration here
        this.bind(RestExplorerBindings.CONFIG).to({
            path: '/explorer',
        });
        this.component(RestExplorerComponent);

        this.projectRoot = __dirname;

        this.component(AuthenticationComponent);
        this.bind(AuthenticationBindings.STRATEGY).toProvider(AuthStrategyProvider);

        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}
