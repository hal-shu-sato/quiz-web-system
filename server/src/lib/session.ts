import session from 'express-session';

import config from '../config';

import redisStore from './redis';

const sessionMiddleware = session({
  secret: config.sessionSecret,
  name: 'qsid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 3 * 60 * 60 * 1000,
  },
  store: redisStore,
});

export default sessionMiddleware;
