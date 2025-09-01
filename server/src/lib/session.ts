import session from 'express-session';

import config from '../config';

const sessionMiddleware = session({
  secret: config.sessionSecret,
  name: 'qsid',
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 3 * 60 * 60 * 1000,
  },
});

export default sessionMiddleware;
