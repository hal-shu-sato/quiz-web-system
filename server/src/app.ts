import express from 'express';
import apiRoutes from './api/routes';
import cors from 'cors';
import config from './config';
import { RegisterRoutes } from './build/routes';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('files'));

app.use('/api', apiRoutes);

RegisterRoutes(app);

export default app;
