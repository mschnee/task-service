import test, {ExecutionContext} from 'ava';

import {Client} from '@loopback/testlab';
import {TaskServiceApplication} from '../../..';
import {createUserAndGetToken, setupApplication} from '../../../__tests__/acceptance/test-helper';

const TEST_USERNAME1 = '__testemail__v1_task_user1@test.com';
const TEST_PASSWORD1 = 'iamaprettyp4ssw04d!';

const TEST_USERNAME2 = '__testemail__v1_task_user2@test.com';
const TEST_PASSWORD2 = 'iamaprettierp4ssw04d!';

import {CreateTaskRequest} from '../../../models/task/';

let app: TaskServiceApplication;
let client: Client;

const USER1_TASKS: Array<Partial<CreateTaskRequest>> = [
    {
        name: 'user1-task-1',
        description: 'task 1 for user 1',
        dueDate: '2019-05-02T16:28:47.450Z',
    },
    {
        name: 'user1-task-2',
        description: 'task 2 for user 1',
        dueDate: '2019-05-03T16:28:47.450Z',
    },
];

test.before(async () => {
    ({app, client} = await setupApplication());
});

test.after(async () => {
    await app.stop();
});

test('Should let me create tasks', async t => {
    const user1Token = await createUserAndGetToken(client, TEST_USERNAME1, TEST_PASSWORD1);

    const createResponse = await client
        .post('/v1/task')
        .set('Content-Type', 'application/json')
        .set('Authorization', `bearer ${user1Token}`)
        .send(USER1_TASKS[0]);

    t.is(createResponse.status, 200);
    t.truthy(createResponse.body.id);
});

test('Should let me update the name', async t => {
    const user1Token = await createUserAndGetToken(client, TEST_USERNAME1, TEST_PASSWORD1);

    const NEW_NAME = 'This is a new name';

    const createResponse = await client
        .post('/v1/task')
        .set('Content-Type', 'application/json')
        .set('Authorization', `bearer ${user1Token}`)
        .send(USER1_TASKS[0]);

    t.is(createResponse.status, 200);
    t.truthy(createResponse.body.id);

    const getResponse = await client
        .get(`/v1/task/${createResponse.body.id}`)
        .set('Authorization', `bearer ${user1Token}`);

    t.deepEqual(getResponse.body, {id: createResponse.body.id, status: 'new', ...USER1_TASKS[0]});

    const updateResponse = await client
        .put(`/v1/task/${createResponse.body.id}`)
        .set('Authorization', `bearer ${user1Token}`)
        .send({name: NEW_NAME});

    t.is(updateResponse.status, 200);

    const getResponse2 = await client
        .get(`/v1/task/${createResponse.body.id}`)
        .set('Authorization', `bearer ${user1Token}`);

    t.is(getResponse2.body.name, NEW_NAME);
});

test('Should not let me set an invalid status', async t => {
    const user1Token = await createUserAndGetToken(client, TEST_USERNAME1, TEST_PASSWORD1);

    const NEW_STATUS = 'in-progress';

    const createResponse = await client
        .post('/v1/task')
        .set('Content-Type', 'application/json')
        .set('Authorization', `bearer ${user1Token}`)
        .send(USER1_TASKS[0]);

    t.is(createResponse.status, 200);
    t.truthy(createResponse.body.id);

    const updateResponse = await client
        .put(`/v1/task/${createResponse.body.id}`)
        .set('Authorization', `bearer ${user1Token}`)
        .send({status: NEW_STATUS});

    t.not(updateResponse.status, 200);
});

test("ACL - User1 shouldn't see User2's tasks", async t => {
    const user1Token = await createUserAndGetToken(client, TEST_USERNAME1, TEST_PASSWORD1);

    const user2Token = await createUserAndGetToken(client, TEST_USERNAME2, TEST_PASSWORD2);

    const createResponse1 = await client
        .post('/v1/task')
        .set('Content-Type', 'application/json')
        .set('Authorization', `bearer ${user1Token}`)
        .send(USER1_TASKS[0]);

    // user 2 cannot get user 1's task
    const getResponse1 = await client
        .get(`/v1/task/${createResponse1.body.id}`)
        .set('Authorization', `bearer ${user2Token}`);

    t.is(getResponse1.status, 401);

    // user 1 can still get user 1's task
    const getResponse2 = await client
        .get(`/v1/task/${createResponse1.body.id}`)
        .set('Authorization', `bearer ${user1Token}`);

    t.is(getResponse2.status, 200);
});
