import mongoose, { Document, Model, model, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: null },
  courses: { type: Array, default: [] },
});

interface UserInterface extends Document {
  username: string;
  email: string;
  emailVerified: boolean;
  courses: string[];
}

export const User =
  (mongoose.models.User as Model<UserInterface>) ||
  model<UserInterface>('User', UserSchema);
