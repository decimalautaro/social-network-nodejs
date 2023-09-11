export interface IModelBase {
  _id?: string;
  createdAt: Date;
  updateAt: Date;
  deleted: boolean;
}

export const modelBase = {
  createdAt: { type: Date, required: true, default: new Date() },
  updateAt: { type: Date, required: true, default: new Date() },
  deleted: { type: Boolean, required: true, default: false },
};
