import { Request, Response } from 'express';
import {
  abortLaunch,
  scheduleNewLaunch,
  getAllLaunches,
  launchExist,
} from '../../models/launches.model';
import { getPagination } from '../../services/query.service';

export async function httpGetAllLaunches(req: Request, res: Response) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

export async function httpAddNewLaunch(req: Request, res: Response) {
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

  try {
    await scheduleNewLaunch(launch);
    Object.assign(launch, { target: launch.target.keplerName });
    return res.status(201).json(launch);
  } catch (err) {
    return res
      .status(500)
      .json({ error: `Error on scheduling new launch: ${err}` });
  }
}

export async function httpAbortLaunch(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (!(await launchExist(+id))) {
      return res.status(400).json({ error: 'Launch not found' });
    }

    const aborted = await abortLaunch(+id);
    if (aborted) {
      return res.status(200).json({ ok: true });
    } else {
      return res.status(500).json({ error: 'Launch not aborted' });
    }
  } catch (err) {
    return res.status(500).json({ error: `Internal server error: ${err}` });
  }
}
