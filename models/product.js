import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        images: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return Array.isArray(arr) && arr.length > 0;
                },
                message: "At least one image is required",
            },
            required: true,
        },
        price: { type: Number, required: true, min: 0 },
        artist: { type: String, required: true },
        artistName: { type: String },
        isVerified: { type: Boolean, default: false },
        medium: { type: String },
        year: { type: Number, min: 0 },
        dimensions: {
            width: { type: Number, min: 0 },
            height: { type: Number, min: 0 },
            depth: { type: Number, min: 0 },
            unit: { type: String, default: "cm" },
        },
        isFramed: { type: Boolean, default: false },
        location: { type: String },
        tags: { type: [String], default: [] },
        category: { type: String },
        favorites: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Product =
    mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
