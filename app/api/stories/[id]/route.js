import { NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Story from "@/models/story";

export async function GET(req, { params }) {
    const { id } = await params;
    await connectMongoDB();
    const story = await Story.findById(id);
    if (!story)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(story);
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    const { userId } = getAuth(req);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const updates = await req.json();
    await connectMongoDB();
    const allowed = (({ caption, tags, thumbnailUrl, products }) => ({
        caption,
        tags,
        thumbnailUrl,
        products,
    }))(updates);

    const story = await Story.findOneAndUpdate(
        { _id: id, author: userId },
        allowed,
        { new: true }
    );
    if (!story)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(story);
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const { userId } = getAuth(req);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await connectMongoDB();
    const story = await Story.findOneAndDelete({ _id: id, author: userId });
    if (!story)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
}
