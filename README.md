Access Watch Middleware [![Build Status](https://travis-ci.org/access-watch/access-watch-middleware.svg?branch=master)](https://travis-ci.org/access-watch/access-watch-middleware) [![Coverage Status](https://coveralls.io/repos/github/access-watch/access-watch-middleware/badge.svg?branch=master&flushcache)](https://coveralls.io/github/access-watch/access-watch-middleware?branch=master)
-----

Express/connect middleware js for logging an analyzing web traffic using the AccessWatch service.

## Installation ##

```
npm install --save access-watch-middleware 
```

## Usage ##

The `config` object is directly passed to
[access-watch-node](https://github.com/access-watch/access-watch/access-watch-node).
- The only required parameters is `apiKey`.
- You can optionally provide your own caching by passing
  [`cache`](https://github.com/access-watch/access-watch/access-watch-node/blob/master/api.md#AccessWatch.Cache).
  If `cache` is not provided, an in-memory cache will be used.
- If your application is behind a reverse proxy, you will also need to set
  [`fwdHeaders`](https://github.com/access-watch/access-watch-node/blob/master/api.md#accesswatchfwdheaders--accesswatchforwardheaders).

See [access-watch-node](https://github.com/access-watch/access-watch-node) for details.

## Debugging ##

To enable verbose logging, include access-watch-middleware in your `DEBUG` env
variable. 

For example: `npm DEBUG=access-watch-middleware npm start`.

## Example ##

[See the example code.](./example/server.js)

Try it out by cloning this repo and run

```
npm install
npm run example
```

