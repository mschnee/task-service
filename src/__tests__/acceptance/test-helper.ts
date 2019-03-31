import {TaskServiceApplication} from '../..';
import {createRestAppClient, givenHttpServerConfig, Client} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
    const restConfig = givenHttpServerConfig({
        // Customize the server configuration here.
        // Empty values (undefined, '') will be ignored by the helper.
        //
        // host: process.env.HOST,
        // port: +process.env.PORT,
    });

    console.log('creating application for testing');
    const app = new TaskServiceApplication({
        rest: restConfig,
    });

    await app.boot();
    await app.start();

    const client = createRestAppClient(app);

    return {app, client};
}

export interface AppWithClient {
    app: TaskServiceApplication;
    client: Client;
}
