import { Schema, model } from 'mongoose';
import { IModelBase, modelBase } from './BaseMOdel';

export interface IUser extends IModelBase {
  name: string;
  lastname?: string;
  nickName: string;
  email: string;
  password: string;
  role: string;
  image: string;
}

const UserSchema = new Schema<IUser>({
  ...modelBase,
  name: { type: String, required: true },
  lastname: String,
  nickName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, trim: true, unique: true, required: true },
  role: { type: String, default: 'user' },
  image: { type: String, default: 'default.png' },
});

export const User = model<IUser>('User', UserSchema);
