import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Serum, Moisturizer
  skinType: [{ type: String }], // e.g., ["Oily", "Dry"]
  concerns: [{ type: String }], // e.g., ["Acne", "Aging"]
  image: { type: String, required: true },
});

export const Product = models.Product || model('Product', ProductSchema);