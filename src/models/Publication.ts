import { ObjectId, Schema, model } from 'mongoose';
import { IModelBase, modelBase } from './BaseMOdel';

export interface IPublication extends IModelBase {
  user: ObjectId;
  text: string;
  file: string;
}

const PublicationSchema = new Schema<IPublication>({
  ...modelBase,
  user: { type: Schema.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  file: { type: String },
});

export const Publication = model<IPublication>('Publication', PublicationSchema);
