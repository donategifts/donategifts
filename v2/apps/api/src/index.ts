import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(
    '*',
    cors({
        origin: ['http://localhost:3000'],
    }),
);

app.use(logger());

app.get('/hello', (c) => {
    return c.json({ message: 'hello, World!' });
});

serve({
    fetch: app.fetch,
    port: 3001,
}, (info) => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://localhost:${info.port}`);
});
