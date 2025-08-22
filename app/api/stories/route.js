import { NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Story from "@/models/story";

export async function GET(req) {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const author = searchParams.get("author");
    const query = author ? { author } : {};
    const stories = await Story.find(query).sort({ createdAt: -1 });
    return NextResponse.json(stories);
}

export async function POST(req) {
    const { userId } = getAuth(req);
    console.log(userId);

    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectMongoDB();
    const allowed = (({
        mediaUrl,
        mediaType,
        thumbnailUrl,
        caption,
        tags,
        products,
    }) => ({
        mediaUrl,
        mediaType,
        thumbnailUrl,
        caption,
        tags,
        products,
    }))(body);

    const story = await Story.create({ ...allowed, author: userId });
    return NextResponse.json(story, { status: 201 });
}
