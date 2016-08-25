const proxyquire = require('proxyquire').noCallThru();
const test = require('tape');

const dummyCache = {
  get: cb => cb(),
  set: cb => cb(),
  drop: cb => cb()
};

test('it handles configuration', t => {
  t.plan(4);
  let AccessWatchMiddleware;
  let testConfig;

  testConfig = {
    apiKey: '12345',
  };

  AccessWatchMiddleware = proxyquire('./index', {
    'cache-manager': {
      caching: () => {
        t.pass('creates its own cache');
        return 'yay cache!';
      }
    },
    'node-access-watch': function(c) {
      t.notDeepEqual(c, testConfig);
      t.equal('yay cache!', c.cache);
      this.hello = _ => Promise.resolve();
    }
  });
  AccessWatchMiddleware(testConfig);

  testConfig = {
    apiKey: '12345',
    cache: dummyCache
  };

  AccessWatchMiddleware = proxyquire('./index', {
    'cache-manager': {
      caching: () => {
        t.fail('should use the provided cache');
      }
    },
    'node-access-watch': function(c) {
      t.deepEqual(c, testConfig);
      this.hello = _ => Promise.resolve();
    }
  });
  AccessWatchMiddleware(testConfig);


});

test('call hello() on init', t => {
  t.plan(1);
  const AccessWatchMiddleware = proxyquire('./index', {
    'node-access-watch': function () {
      this.hello = function() {
        t.pass('hello() was called');
        return Promise.resolve();
      };
    }
  });
  AccessWatchMiddleware({});
});

test('call checkBlocked() on request', childTest => {
  const mockReq = {a: 1};
  childTest.plan(2);
  childTest.test('handle blocked', t => {
    t.plan(3);

    const mockRes = {
      status: (status) => {
        t.assert(status === 403, 'it blocks')
        return {
          send: () => {
            t.pass('response was sent');
          }
        };
      },
      on: () => {}
    };

    const AccessWatchMiddleware = proxyquire('./index', {
      'node-access-watch': function () {
        this.hello = () => Promise.resolve();
        this.checkBlocked = function(req) {
          t.same(req, mockReq, 'checkBlocked(req) was called');
          return Promise.resolve(true);
        };
      }
    });

    AccessWatchMiddleware({})(mockReq, mockRes, () => {
      t.fail('should not continue');
    });
  });

  childTest.test('handle others', t => {
    t.plan(2);

    const mockRes = {
      on: () => {}
    };

    const AccessWatchMiddleware = proxyquire('./index', {
      'node-access-watch': function() {
        this.hello = () => Promise.resolve();
        this.checkBlocked = req => {
          t.same(req, mockReq, 'checkBlocked(req) was called');
          return Promise.resolve(false);
        };
      }
    });

    AccessWatchMiddleware({})(mockReq, mockRes, () => {
      t.pass('should continue to next middlware');
    });
  });
});

test('call log() after response', t => {
  t.plan(3);

  const mockReq = {a: 1};
  const mockRes = {
    on: (event, fn) => {
      t.assert(event === 'finish', 'listen to response finish');
      process.nextTick(fn);
    }
  };
  const AccessWatchMiddleware = proxyquire('./index', {
    'node-access-watch': function () {

      // make these can also reject
      this.hello = () => Promise.reject();
      this.checkBlocked = req => Promise.reject();
      this.log = (req, res) => {
        t.same(req, mockReq);
        t.same(res, mockRes);
        return Promise.resolve();
      };
    }
  });

  AccessWatchMiddleware({})(mockReq, mockRes, () => {});
});

