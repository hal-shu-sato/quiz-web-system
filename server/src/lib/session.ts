import { RedisStore } from 'connect-redis';
import session from 'express-session';
import { createClient } from 'redis';

import config from '../config';

const redisClient = createClient({
  url: config.redisUrl,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

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
