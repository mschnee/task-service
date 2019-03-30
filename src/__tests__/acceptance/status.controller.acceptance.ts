import test from 'ava';

import {Client} from '@loopback/testlab';
import {TaskServiceApplication} from '../..';
import {setupApplication} from './test-helper';

let app: TaskServiceApplication;
let client: Client;

test.before(async () => {
    ({app, client} = await setupApplication());
});

test.after(async () => {
    await app.stop();
});

test('StatusController should have content', async t => {
    const res = await client.get('/status').expect(200);
    t.is(res.status, 200);
    t.deepEqual(res.body, {greeting: 'Hello from LoopBack'});
});
