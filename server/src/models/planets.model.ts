import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import path from 'path';

const habitablePlanets: any[] = [];

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
      .on('data', (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      })
      .on('end', () => {
        resolve();
      });
  });
}

export function getAllPlanets() {
  return habitablePlanets;
}
