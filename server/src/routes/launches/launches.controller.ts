import { Request, Response } from 'express';
import {
  abortLaunch,
  addNewLaunch,
  getAllLaunches,
} from '../../models/launches.model';

export function httpGetAllLaunches(_req: Request, res: Response) {
  return res.status(200).json(getAllLaunches());
}

export function httpAddNewLaunch(req: Request, res: Response) {
  const launch = req.body;

  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }

  const savedLaunch = addNewLaunch(launch);
  return res.status(201).json(savedLaunch);
}

export function httpAbortLaunch(req: Request, res: Response) {
  const { id } = req.params;

  const flight = abortLaunch(+id);

  if (flight) {
    res.status(200).json(flight);
  } else {
    return res.status(400).json({ error: 'Launch not found' });
  }
}
