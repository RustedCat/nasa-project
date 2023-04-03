import path from 'node:path';

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import planetsRouter from './routes/planets/planets.router';
import launchesRouter from './routes/launches/launches.router';

export const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);
// -- middleware
// logging
app.use(morgan('combined'));
// parse json body
app.use(express.json());
// serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));
// -- routes
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

app.get('/*', (_: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
