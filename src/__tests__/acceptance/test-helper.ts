import {Client, createRestAppClient, givenHttpServerConfig} from '@loopback/testlab';
import {TaskServiceApplication} from '../..';

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

const memoizedUsers = new Map();
export async function createUserAndGetToken(client: Client, email: string, password: string) {
    if (memoizedUsers.has(email)) {
        return memoizedUsers.get(email);
    } else {
        const firstTry = await client
            .post('/v1/user/login')
            .set('Content-Type', 'application/json')
            .send({
                email,
                password,
            });

        if (firstTry.status === 401) {
            const createResponse = await client
                .post('/v1/user/create')
                .set('Content-Type', 'application/json')
                .send({
                    email,
                    password,
                });
            if (createResponse.status !== 200) {
                throw new Error(createResponse.body.error || 'Could not create user');
            }

            const secondTry = await client
                .post('/v1/user/login')
                .set('Content-Type', 'application/json')
                .send({
                    email,
                    password,
                });
            if (secondTry.status !== 200) {
                throw new Error(secondTry.body.error || 'Could not log-in');
            } else {
                memoizedUsers.set(email, secondTry.body.token);
                return secondTry.body.token;
            }
        } else {
            memoizedUsers.set(email, firstTry.body.token);
            return firstTry.body.token;
        }
    }
}
