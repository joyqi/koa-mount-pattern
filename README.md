# koa-mount-pattern

As you may know, there's a famous middleware called [koa-mount](https://github.com/koajs/mount) which is used to mount a middleware to a specific path. But what if you want to mount a middleware to a path pattern? For example, you want to mount a middleware to all paths that start with `/api/(v1|v2|v3)`? This is where `koa-mount-pattern` comes in.

## Installation

```bash
npm install koa-mount-pattern
```

## Usage

```js
const Koa = require('koa');
const { mountPattern } = require('koa-mount-pattern');

const app = new Koa();
app.use(mountPattern('/api/:version', async (ctx, next) => {
  // do something
  await next();
}));
```