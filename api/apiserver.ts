import { Hono } from 'hono';
import type { H } from 'hono/types';
//import { cors } from 'hono/cors';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

type RouteFile = {
  default?: Function
} & { [M in (typeof METHODS)[number]]?: H[] };

const filePathToPath = (filePath: string) => {
  filePath = filePath
    .replace(/\.ts$/g, '')
    .replace(/^\/?index/, '/') // `/index`
    .replace(/\/index/, '') // `/about/index`
    .replace(/\[\.{3}.+\]/, '*')
    .replace(/\[(.+)\]/, ':$1');
  return /^\//.test(filePath) ? filePath : '/' + filePath;
}

const ROUTES = import.meta.glob<RouteFile>('/api/routes/**/[a-z0-9[-][a-z0-9[_-]*.ts', {
  eager: true
})

export const createApi = () => {
  const app = new Hono();

  //app.use('*', cors());

  for (const [key, route] of Object.entries(ROUTES)) {
    const path = filePathToPath(key.replace(/^\/api\/routes\//, ''));

    for (const m of METHODS) {
      const handlers = route[m];
      if (handlers) {
        app.on(m, path, ...handlers);
      }
    }

    app.get(path, (c) => {
      if (route.default) {
        return route.default(c);
      }
      return c.notFound();
    })
  }

  return app;
}
