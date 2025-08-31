const config = {
  port: process.env.PORT || 4000,
  corsOrigin: process.env.SERVER_CORS_ORIGIN || 'http://localhost:3000',
};

export default config;
