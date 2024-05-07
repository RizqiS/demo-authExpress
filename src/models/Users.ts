import mongoose, { Document, Schema } from "mongoose";

interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUsers>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUsers>("demo_signups", userSchema);
