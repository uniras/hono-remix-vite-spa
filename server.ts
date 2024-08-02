import type { AppLoadContext } from '@remix-run/cloudflare';
import { createRequestHandler } from '@remix-run/cloudflare';
import { createApi } from './api/apiserver';
import { showRoutes } from 'hono/dev';

const app = createApi();

app.all('*', async (c) => {
  // @ts-expect-error it's not typed
  const build = await import('virtual:remix/server-build');
  const handler = createRequestHandler(build, 'development');
  const remixContext = {
    cloudflare: {
      env: c.env
    }
  } as unknown as AppLoadContext;
  return handler(c.req.raw, remixContext);
})

showRoutes(app);

export default app;
