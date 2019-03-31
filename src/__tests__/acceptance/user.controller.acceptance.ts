import test from 'ava';

import {Client} from '@loopback/testlab';
import {TaskServiceApplication} from '../..';
import {setupApplication} from './test-helper';

let app: TaskServiceApplication;
let client: Client;

const TEST_USERNAME = '__testemail@test.com';
const TEST_PASSWORD = 'iamaprettyp4ssw04d!';

test.beforeEach(async () => {
    ({app, client} = await setupApplication());
});

test.afterEach(async () => {
    await app.stop();
});

test('Should let me create a user', async t => {
    const failingWhoami = await client.get('/v1/user/whoami');
    t.is(failingWhoami.status, 401);

    const createResponse = await client
        .post('/v1/user/create')
        .set('Content-Type', 'application/json')
        .send({
            email: TEST_USERNAME,
            password: TEST_PASSWORD,
        });

    t.is(createResponse.status, 200);
    t.truthy(createResponse.body.id);

    const loginResponse = await client
        .post('/v1/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: TEST_USERNAME,
            password: TEST_PASSWORD,
        });

    t.is(loginResponse.status, 200);
    t.truthy(loginResponse.body.token);

    const successfulWhoami = await client.get('/v1/user/whoami').set('Authorization', `bearer ${loginResponse.body.token}`);

    t.is(successfulWhoami.status, 200);
    t.is(successfulWhoami.text, TEST_USERNAME);
});
