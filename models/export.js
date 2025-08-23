import mongoose from "mongoose";

const ExportSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        userId: { type: String, required: true },
        compliance: { type: Object, required: true },
        uploads: { type: Object, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Export || mongoose.model("Export", ExportSchema);
