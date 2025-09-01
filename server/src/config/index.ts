const config = {
  port: process.env.PORT || 4000,
  corsOrigin: process.env.SERVER_CORS_ORIGIN || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 's3Cur3',
  redisUrl: process.env.REDIS_URL || 'redis://:redispass@localhost:6379',
};

export default config;
