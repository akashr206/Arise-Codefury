import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        profile: { type: String, required: true },
        id: { type: String, required: true },
        role: { type: String, default: "user" },
        username: { type: String, required: true, unique: true },
        bio: { type: String },
        location: { type: String },
        categories: { type: [String], default: [] },
        instagram: { type: String },
        twitter: { type: String },
        artworks: { type: Number, default: 0 },
        stories: { type: Number, default: 0 },
        followers: { type: Number, default: 0 },
        following: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
