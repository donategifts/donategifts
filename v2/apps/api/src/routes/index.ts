import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const index = new Hono();

const schema = z.object({
    name: z.string(),
    email: z.string().email(),
});

index.get('/', zValidator('query', schema), async (c) => {
    const { name, email } = c.req.query();
    if (name === 'error') {
        throw new Error('Name is error');
    }

    return c.json({ name, email });
});

export default index;

export type Index = typeof index;
