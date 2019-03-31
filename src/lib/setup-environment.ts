import {Context} from '@loopback/core';

export default function setupEnvironment(context: Context) {
    /**
     * Set up environment variables here
     */
    if (process.env.REDIS_URL) {
        context.bind('datasources.config.redis').to({
            name: 'redis',
            connector: 'kv-redis',
            url: process.env.REDIS_URL,
        });
    }

    if (process.env.TASKDB_URL) {
        context.bind('datasources.config.task_db').to({
            name: 'task_db',
            connector: 'mongodb',
            url: process.env.TASKDB_URL,
        });
    }
}
