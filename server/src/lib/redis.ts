import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

import config from '../config';

const redisClient = createClient({
  url: config.redisUrl,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
});

export default redisStore;
