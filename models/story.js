import mongoose, { Schema } from "mongoose";

const StorySchema = new Schema(
    {
        author: { type: String, required: true },
        mediaUrl: { type: String, required: true },
        mediaType: { type: String, enum: ["image", "video"], required: true },
        thumbnailUrl: { type: String },
        products: { type: Array },
        caption: { type: String },
        tags: { type: [String], default: [] },
        durationSec: { type: Number, min: 0 },
        likesCount: { type: Number, default: 0 },
        viewsCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const Story = mongoose.models.Story || mongoose.model("Story", StorySchema);
export default Story;
