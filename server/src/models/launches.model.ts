interface Launch {
  flightNumber?: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customer?: string[];
  upcoming?: boolean;
  success?: boolean;
}

let latestFlightNumber = 100;

const launches: Map<number, Launch> = new Map();

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NOAA', 'NASA'],
  upcoming: true,
  success: true,
};

launches.set(launch.flightNumber, launch);

export function launchExist(id: number) {
  return launches.has(id);
}

export function getAllLaunches() {
  return Array.from(launches.values());
}

export function addNewLaunch(launch: Launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      success: true,
      upcoming: true,
      customers: ['NOAA', 'NASA'],
    })
  );
  return launches.get(latestFlightNumber);
}

export function abortLaunch(flightNumber: number) {
  const aborted = launches.get(flightNumber);
  aborted!.upcoming = false;
  aborted!.success = false;
  return aborted;
}
