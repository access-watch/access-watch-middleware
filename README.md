Access Watch Middleware [![Build Status](https://travis-ci.org/access-watch/access-watch-middleware.svg?branch=master)](https://travis-ci.org/access-watch/access-watch-middleware) [![Coverage Status](https://coveralls.io/repos/github/access-watch/access-watch-middleware/badge.svg?branch=master&flushcache)](https://coveralls.io/github/access-watch/access-watch-middleware?branch=master)
-----

Express/connect middleware js for logging an analyzing web traffic using the AccessWatch service.

## Installation ##

```
npm install --save access-watch-middleware 
```

## Usage ##

The `config` object is directly passed to
[access-watch-node](https://github.com/access-watch/access-watch/access-watch-node). Required parameters are `apiKey` and
[`cache`](https://github.com/access-watch/access-watch/access-watch-node/blob/master/api.md#AccessWatch.Cache).
If your application is behind a reverse proxy, you also need to set
[`fwdHeaders`](https://github.com/access-watch/access-watch-node/blob/master/api.md#accesswatchfwdheaders--accesswatchforwardheaders).

See [access-watch-node](https://github.com/access-watch/access-watch-node) for details.

## Debugging ##

To enable verbose logging, include access-watch-middleware in your `DEBUG` env
variable. 

For example: `npm DEBUG=access-watch-middleware npm start`.

## Example ##

```js
'use strict';

const express = require('express');
const app = express();
const accessWatchMiddleware = require('..');

const cacheManager = require('cache-manager');

const awCache = cacheManager.caching({
  store: 'memory',
  ttl: 20 * 60
});

app.use(accessWatchMiddleware({
  apiKey: '1b3e63591870fdd1b3cd6eb304b81aa1',
  cache: awCache
}));

app.get('/', (req, res, next) => {
  res.send('Hello World!');
  next();
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
```

Try it out by cloning this repo and run

```
npm install
npm run example
```

