import axios from 'axios';
import { Launch, ILaunch } from './launches.mongo';
import { Planet } from './planets.mongo';

const DEFAULT_FLIGHT_NUMBER = 99;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
      pagination: false,
    },
  });

  if (response.status !== 200) {
    console.error('Error downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc.payloads;
    const customers = payloads.flatMap((payload: any) => payload.customers);

    const launch: ILaunch = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
      customers,
    };
    console.log(`${launch.flightNumber} - ${launch.mission}`);
    saveLaunch(launch);
  }
}

export async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (!firstLaunch) {
    await populateLaunches();
  }
}

async function findLaunch(filter: any, options = {}) {
  return await Launch.findOne(filter, options);
}

export async function launchExist(flightNumber: number) {
  return await findLaunch({ flightNumber }, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  try {
    const leastLaunch = await Launch.findOne({}).sort('-flightNumber');
    return leastLaunch ? leastLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
  } catch (error) {
    return DEFAULT_FLIGHT_NUMBER;
  }
}

export async function getAllLaunches(skip: number, limit: number) {
  return await Launch.find({}, { _id: 0, __v: 0 })
    .populate({
      path: 'target',
      select: 'keplerName -_id',
    })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

export async function scheduleNewLaunch(launch: ILaunch) {
  const target = await Planet.findOne({ keplerName: launch.target });

  if (!target) {
    throw new Error('No matching planet not found');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    target,
    customers: ['NASA', 'NOAA'],
  });

  await saveLaunch(newLaunch);
}

async function saveLaunch(launch: ILaunch) {
  await Launch.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}

export async function abortLaunch(flightNumber: number) {
  try {
    const aborted = await Launch.updateOne(
      { flightNumber },
      {
        aborted: true,
        upcoming: false,
        success: false,
      }
    );
    return aborted.modifiedCount === 1;
  } catch (err) {
    throw new Error(`Error on aborting the mission: ${err}`);
  }
}
