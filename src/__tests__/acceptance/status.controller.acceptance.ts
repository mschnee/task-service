import test, {ExecutionContext} from 'ava';

import {Client} from '@loopback/testlab';
import {TaskServiceApplication} from '../..';
import {setupApplication} from './test-helper';

interface TestContext extends ExecutionContext {
    context: {
        app: TaskServiceApplication;
        client: Client;
    };
}

test.before(async (t: TestContext) => {
    const {app, client} = await setupApplication();
    t.context = {
        app,
        client,
    };
});

test.after(async (t: TestContext) => {
    await (t.context.app as TaskServiceApplication).stop();
});

test('StatusController should have content', async (t: TestContext) => {
    const res = await (t.context.client as Client).get('/status').expect(200);
    t.is(res.status, 200);
    t.truthy(res.body.cacheDb);
    t.truthy(res.body.task_db);
});
