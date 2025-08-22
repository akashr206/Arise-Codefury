import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
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
    const { userId } = auth();
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
        durationSec,
        aspectRatio,
    }) => ({
        mediaUrl,
        mediaType,
        thumbnailUrl,
        caption,
        tags,
        durationSec,
        aspectRatio,
    }))(body);

    const story = await Story.create({ ...allowed, author: userId });
    return NextResponse.json(story, { status: 201 });
}
