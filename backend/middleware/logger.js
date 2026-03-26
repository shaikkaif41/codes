const morgan = require('morgan');

const logger = morgan((tokens, req, res) => {
  return [
    `[${new Date().toISOString()}]`,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms',
    '-',
    tokens.res(req, res, 'content-length') || '0', 'bytes',
  ].join(' ');
});

module.exports = logger;
