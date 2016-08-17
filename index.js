const httpStatus = require('http').STATUS_CODES;

const debug = require('debug')('access-watch-middleware');
const AccessWatch = require('node-access-watch');

module.exports = config => {
  const aw = new AccessWatch(config);

  // Say hello to access watch and see that give's a pleasent response
  aw.hello().then(_ => {
    debug('AccessWatch is ready!');
  }).catch(err => {
    console.error('Error connecting to AccessWatch: ' + err.message);
  });

  return function AccessWatch(req, res, next) {
    aw.checkBlocked(req).then(blocked => {
      if (blocked) {
        debug('Blocking request. HTTP headers: %j', req.headers);
        res.status(403).send(httpStatus[403]);
      } else {
        next();
      }
    });

    res.on('finish', () => {
      aw.log(req, res).then(_ => {
        debug('Logged request. HTTP headers: %j', req.headers);
      }).catch(err => {
        debug('Error logging request. HTTP headers: %j. Error: %s', req.headers, err.message);
      });
    });
  };
};
