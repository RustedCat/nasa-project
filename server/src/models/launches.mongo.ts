import { Schema, model, Types } from 'mongoose';

export interface ILaunch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target?: Types.ObjectId;
  customers?: string[];
  upcoming?: boolean;
  success?: boolean;
  aborted?: boolean;
}

const launchSchema = new Schema<ILaunch>({
  flightNumber: { type: Number, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  target: {
    type: Schema.Types.ObjectId,
    ref: 'Planet',
    required: false,
  },
  customers: { type: [String], required: true, default: ['NASA', 'NOAA'] },
  upcoming: { type: Boolean, required: true, default: true },
  success: { type: Boolean, required: true, default: true },
  aborted: { type: Boolean, required: true, default: false },
});

export const Launch = model<ILaunch>('Launch', launchSchema);
