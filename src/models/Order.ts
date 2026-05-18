import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  userId: { type: String, required: true },
  items: [{ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String 
  }],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // 'stripe' or 'cod'
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    zipCode: String,
    phone: String,
  },
  status: { type: String, default: 'Processing' }, // 'Processing', 'Shipped', 'Delivered'
}, { timestamps: true });

export const Order = models.Order || model('Order', OrderSchema);