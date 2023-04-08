require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

import mongoose from 'mongoose';

mongoose.connection.once('open', () => {
  console.log('Connected MongoDB NASA Sever');
});

mongoose.connection.on('error', (err) => {
  console.error(`Error on connecting to MongoDB server: ${err}`);
});

export async function mongoConnect() {
  await mongoose.connect(MONGO_URL!);
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
