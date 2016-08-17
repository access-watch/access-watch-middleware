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
