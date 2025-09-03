import config from '../config';

export const corsOptions = {
  origin: config.corsOrigin,
  methods: ['GET', 'POST'],
  credentials: true,
};
