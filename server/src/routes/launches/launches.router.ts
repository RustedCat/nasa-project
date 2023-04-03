import { Router } from 'express';
import {
  httpAbortLaunch,
  httpAddNewLaunch,
  httpGetAllLaunches,
} from './launches.controller';

const launchesRouter = Router();

launchesRouter
  .get('/', httpGetAllLaunches)
  .post('/', httpAddNewLaunch)
  .delete('/:id', httpAbortLaunch);

export default launchesRouter;
