import {TaskServiceApplication} from './application';
import {ApplicationConfig} from '@loopback/core';

export {TaskServiceApplication};

export async function main(options: ApplicationConfig = {}) {
    const app = new TaskServiceApplication(options);
    await app.boot();
    await app.start();

    const url = app.restServer.url;
    console.log(`Server is running at ${url}`);
    console.log(`Try ${url}/ping`);

    return app;
}
