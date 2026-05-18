import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  // ADD THIS LINE BELOW:
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 
}, { timestamps: true });

export const User = models.User || model('User', UserSchema);