const config = {
  port: process.env.PORT || 4000,
  corsOrigin: process.env.SERVER_CORS_ORIGIN || 'http://localhost:3000',
  sessionSecret: process.env.SESSION_SECRET || 's3Cur3',
};

export default config;
