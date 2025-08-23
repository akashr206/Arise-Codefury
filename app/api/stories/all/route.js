import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Story from "@/models/story";
import User from "@/models/user";

export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 100;
        const skip = (page - 1) * limit;

        const author = searchParams.get("author");
        const mediaType = searchParams.get("mediaType");
        const tags = searchParams.get("tags");

        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const query = {};
        if (author) query.author = author;
        if (mediaType) query.mediaType = mediaType;
        if (tags) {
            const tagArray = tags.split(",").map((tag) => tag.trim());
            query.tags = { $in: tagArray };
        }

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const totalStories = await Story.countDocuments(query);
        const totalPages = Math.ceil(totalStories / limit);

        let stories = await Story.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

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
            authorUsername: authorMap[story.author]?.username || "user",
            authorVerified: authorMap[story.author]?.isVerified || false,
        }));

        return NextResponse.json({
            stories,
            pagination: {
                currentPage: page,
                totalPages,
                totalStories,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
