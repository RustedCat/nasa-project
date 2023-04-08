import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import path from 'path';
import { Planet } from './planets.mongo';

function isHabitablePlanet(planet: any) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

export async function loadPlanetsData() {
  return new Promise<void>((resolve, reject) => {
    createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'),
      {
        encoding: 'utf-8',
      }
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        savePlanet(data);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('end', async () => {
        console.log(`${(await Planet.find({})).length} Habitable found!`);
        resolve();
      });
  });
}

async function savePlanet(planet: any) {
  try {
    if (isHabitablePlanet(planet)) {
      const update = { keplerName: planet.kepler_name };
      await Planet.findOneAndUpdate(update, update, { upsert: true });
    }
  } catch (err) {
    console.error(`Could not save the planet ${err}`);
  }
}

export async function getAllPlanets() {
  return await Planet.find({}, { _id: 0, __v: 0 });
}
