import { ObjectId, Schema, model } from 'mongoose';
import { IModelBase, modelBase } from './BaseMOdel';

export interface IFollow extends IModelBase {
  user: ObjectId;
  followed: ObjectId;
}

const FollowSchema = new Schema<IFollow>({
  ...modelBase,
  user: { type: Schema.ObjectId, ref: 'User' },
  followed: { type: Schema.ObjectId, ref: 'User' },
});

export const Follow = model<IFollow>('Follow', FollowSchema);
