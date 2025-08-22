import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        profile: { type: String, required: true },
        id: { type: String, required: true },
        role: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        bio: { type: String },
        location: { type: String },
        joinedAt: { type: Date, default: Date.now },
        categories: { type: [String], default: [] },
        instagram: { type: String },
        twitter: { type: String },
        artworksCount: { type: Number, default: 0 },
        storiesCount: { type: Number, default: 0 },
        followersCount: { type: Number, default: 0 },
        followingCount: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
