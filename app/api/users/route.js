import { connectMongoDB } from "@/lib/db";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectMongoDB();

        let user = await User.findOne({ id: clerkUser.id });

        if (!user) {
            user = await User.create({
                id: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress || "",
                name: clerkUser.fullName || "",
                profile: clerkUser.imageUrl || "",
                username:
                    clerkUser.username ||
                    clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
            });
        }

        return NextResponse.json({ user }, { status: 201 });
    } catch (err) {
        console.error("Error creating/fetching user:", err);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
