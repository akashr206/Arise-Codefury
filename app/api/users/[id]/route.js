import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await connectMongoDB();

        const { id } = params;

        const user = await User.findOne({ username: id });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(req, { params }) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectMongoDB();

        const { id } = await params;
        const updates = await req.json();

        const user = await User.findOne({ id: userId });
        if (!user || user.id !== id) {
            return NextResponse.json(
                { error: "Forbidden - Can only edit your own profile" },
                { status: 403 }
            );
        }

        const allowedUpdates = {};
        const allowedFields = [
            "name",
            "username",
            "bio",
            "location",
            "categories",
            "instagram",
            "twitter",
        ];

        allowedFields.forEach((field) => {
            if (updates[field] !== undefined) {
                allowedUpdates[field] = updates[field];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            allowedUpdates,
            { new: true, runValidators: true }
        );

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
