import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { HTTPException } from 'hono/http-exception';
import index from './routes/index';

const app = new Hono();

app.use(
    '*',
    cors({
        origin: (origin) => {
            return origin.endsWith('.donate-gifts.com') ? origin : 'http://localhost:3000';
        },
    }),
);

app.use(logger());

app.route('/', index);

app.onError((err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    return c.json({ statusText: 'Internal Server Error' }, 500);
});

serve({
    fetch: app.fetch,
    port: 3001,
}, (info) => {
    // eslint-disable-next-line no-console
    console.log(`Listening on http://localhost:${info.port}`);
});
