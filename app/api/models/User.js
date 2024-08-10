import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  image: { type: String },
  role: { type: String, default: 'user' }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
