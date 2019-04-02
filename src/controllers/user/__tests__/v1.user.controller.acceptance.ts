import test from 'ava';

import {Client} from '@loopback/testlab';
import {TaskServiceApplication} from '../../..';
import {setupApplication} from '../../../__tests__/acceptance/test-helper';

let app: TaskServiceApplication;
let client: Client;

const TEST_USERNAME = '__testemail@test.com';
const TEST_PASSWORD = 'iamaprettyp4ssw04d!';

test.before(async () => {
    ({app, client} = await setupApplication());
});

test.after(async () => {
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

    const successfulWhoami = await client
        .get('/v1/user/whoami')
        .set('Authorization', `bearer ${loginResponse.body.token}`);

    t.is(successfulWhoami.status, 200);
    t.is(successfulWhoami.text, TEST_USERNAME);
});

const TEST_USERNAME1 = '__testemail1@test.com';
const TEST_PASSWORD1 = '1amaprettyp4ssw04d!';

test('Re-creating the same user should be forbidden', async t => {
    const failingWhoami = await client.get('/v1/user/whoami');
    t.is(failingWhoami.status, 401);

    const createResponse1 = await client
        .post('/v1/user/create')
        .set('Content-Type', 'application/json')
        .send({
            email: TEST_USERNAME1,
            password: TEST_PASSWORD1,
        });

    t.is(createResponse1.status, 200);
    t.truthy(createResponse1.body.id);

    const createResponse2 = await client
        .post('/v1/user/create')
        .set('Content-Type', 'application/json')
        .send({
            email: TEST_USERNAME1,
            password: TEST_PASSWORD1,
        });

    t.is(createResponse2.status, 409);
});

const NOT_USERNAME = '__test_notauser@test.com';
const NOT_PASSWORD = 'anyl1ttl3oldp4ssword';

test('Shouldnt log into a non-existant user', async t => {
    const loginResponse = await client
        .post('/v1/user/login')
        .set('Content-Type', 'application/json')
        .send({
            email: NOT_USERNAME,
            password: NOT_PASSWORD,
        });

    t.is(loginResponse.status, 403);
});
