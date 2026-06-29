const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio'],
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
      max: [100, 'No se pueden agregar más de 100 unidades del mismo producto'],
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    appliedCoupon: {
      code: { type: String, uppercase: true, trim: true },
      discountPercent: { type: Number, min: 0, max: 100 },
    },
    // TTL: el carrito expira si no hay actividad en 7 días
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

cartSchema.index({ user: 1 });

// Renovar TTL al modificar el carrito
cartSchema.pre('save', function (next) {
  this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  next();
});

module.exports = mongoose.model('Cart', cartSchema);