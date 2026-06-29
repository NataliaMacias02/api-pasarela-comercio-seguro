const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'El producto es obligatorio'],
    },
    name: { type: String, required: true }, // snapshot del nombre al momento de la compra
    sku: { type: String, required: true },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'El precio unitario es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    appliedDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // porcentaje
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario es obligatorio'],
    },
    orderNumber: {
      type: String,
      unique: true,
      // Se genera en el pre-save hook
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'La orden debe contener al menos un producto',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'El subtotal no puede ser negativo'],
    },
    discountTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxes: {
      type: Number,
      default: 0,
      min: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    status: {
      type: String,
      enum: [
        'pendiente',
        'confirmado',
        'en_preparacion',
        'enviado',
        'entregado',
        'cancelado',
        'reembolsado',
      ],
      default: 'pendiente',
    },
    paymentMethod: {
      type: String,
      enum: ['tarjeta', 'transferencia', 'paypal', 'efectivo_contra_entrega', 'otro'],
      required: [true, 'El método de pago es obligatorio'],
    },
    // Solo token/referencia del gateway de pagos; NUNCA datos de tarjeta en crudo
    paymentReference: {
      type: String,
      trim: true,
      select: false,
    },
    paymentStatus: {
      type: String,
      enum: ['pendiente', 'pagado', 'fallido', 'reembolsado'],
      default: 'pendiente',
    },
    shippingAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true, default: 'México' },
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Las notas no pueden superar los 500 caracteres'],
    },
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.paymentReference;
        return ret;
      },
    },
  }
);

// Generar número de orden único antes de guardar
orderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  this.orderNumber = `ORD-${timestamp}-${random}`;
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);