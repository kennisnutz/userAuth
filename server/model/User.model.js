import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide valid username'],
    unique: [true, 'Username already exists'],
  },
  password: {
    type: String,
    required: [true, 'Please provide valid password'],
    unique: false,
  },
  email: {
    type: String,
    required: [true, 'Please provide valid email'],
    unique: [true, 'Email already exists'],
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  profile: { type: String },
  walletAddress: { type: String },
});

export default mongoose.models.Users || mongoose.model('User', UserSchema);
