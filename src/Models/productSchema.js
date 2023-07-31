import mongoose from "mongoose";

const productDetailsSchema = mongoose.Schema(
  {
    styleCode: {
      type: String,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
      enum: ["S", "M", "L", "XL"],
    },
    pattern: {
      type: String,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const productDetail = mongoose.model("productDetail", productDetailsSchema);
export { productDetail };

const productSchema = mongoose.Schema(
  {
    uesrToken: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      trim: true,
    },
    images: {
      type: Array,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    productDetailsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productDetail",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("product", productSchema);
export { product };
