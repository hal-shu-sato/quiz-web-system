const config = {
  port: process.env.PORT || 4000,
  corsOrigin: process.env.SERVER_CORS_ORIGIN || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'Mys3cr3t',
  jwtIssuer: process.env.JWT_ISSUER || 'quiz-app',
  jwtAudience: process.env.JWT_AUDIENCE || 'quiz-app-users',
};

export default config;
