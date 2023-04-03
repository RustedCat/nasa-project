const PORT = +(process.env.PORT || 8000);

import http from 'node:http';
import { app } from './app';

import { loadPlanetsData } from './models/planets.model';

const server = http.createServer(app);

(async function () {
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
