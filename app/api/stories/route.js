import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Story from "@/models/story";
import User from "@/models/user";

export async function GET(req) {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const author = searchParams.get("author");

    const query = author ? { author } : {};
    let stories = await Story.find(query).sort({ createdAt: -1 }).lean();
    const authorIds = [...new Set(stories.map((s) => s.author))];

    const authors = await User.find({ id: { $in: authorIds } }).lean();
    const authorMap = authors.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    stories = stories.map((story) => ({
        ...story,
        authorName: authorMap[story.author]?.name || "Unknown",
        authorProfile: authorMap[story.author]?.profile || null,
    }));

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
