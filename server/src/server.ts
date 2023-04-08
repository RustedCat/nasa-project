require('dotenv').config();

const PORT = +(process.env.PORT || 8000);

import http from 'node:http';

import { app } from './app';
import { mongoConnect } from './services/mongo.service';
import { loadLaunchData } from './models/launches.model';

const server = http.createServer(app);

(async function () {
  await mongoConnect();
  await loadLaunchData();
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
