import cors from 'cors';
import express, { Request as ExRequest, Response as ExResponse } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiRoutes from './api/routes';
import { RegisterRoutes } from './build/routes';
import config from './config';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('files'));
app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUi.generateHTML(await import('../build/swagger.json')),
  );
});

app.use('/api', apiRoutes);

RegisterRoutes(app);

export default app;
