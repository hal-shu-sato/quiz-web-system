import { createServer } from 'http';
import app from './app';
import config from './config';
import { initializeSocket } from './sockets';

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
