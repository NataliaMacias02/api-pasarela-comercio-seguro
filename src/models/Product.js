const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre es demasiado corto'],
      maxlength: [200, 'El nombre no puede superar los 200 caracteres'],
    },
    sku: {
      type: String,
      required: [true, 'El SKU es obligatorio'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9\-]{4,20}$/, 'SKU inválido: solo letras mayúsculas, números y guiones (4-20 caracteres)'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'La descripción no puede superar los 2000 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: [
        'desengrasantes',
        'desinfectantes',
        'detergentes',
        'limpiavidrios',
        'ambientadores',
        'blanqueadores',
        'multiusos',
        'cera y brilladores',
        'drenajes y tuberías',
        'insecticidas',
        'herramientas de limpieza',
        'insumos industriales',
        'otro',
      ],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre de la marca no puede superar los 100 caracteres'],
    },
    // Contenido del producto: ficha técnica/seguridad relevante
    specifications: {
      volume: { type: String, trim: true },       // ej. "1L", "500ml"
      format: { type: String, trim: true },       // ej. "líquido", "polvo", "pastilla"
      scent: { type: String, trim: true },        // ej. "lavanda", "sin aroma"
      concentration: { type: String, trim: true }, // ej. "concentrado", "listo para usar"
      isEcoFriendly: { type: Boolean, default: false },
      isIndustrial: { type: Boolean, default: false },
      safetyWarning: {
        type: String,
        trim: true,
        maxlength: [500, 'La advertencia de seguridad no puede superar los 500 caracteres'],
      },
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    stockMinAlert: {
      type: Number,
      default: 10,
      min: 0,
    },
    images: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 5,
        message: 'No se pueden agregar más de 5 imágenes por producto',
      },
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    tags: {
      type: [String],
      default: [],
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

// Índices para búsqueda en catálogo
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 }); // Para alertas de stock bajo

module.exports = mongoose.model('Product', productSchema);