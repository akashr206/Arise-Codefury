import { NextResponse } from "next/server";
import { auth, currentUser, getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import User from "@/models/user";
import Product from "@/models/product";

export async function GET(req) {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const artist = searchParams.get("artist");
    const category = searchParams.get("category");
    const query = {};
    if (artist) query.artist = artist;
    if (category) query.category = category;
    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products);
}

export async function POST(req) {
    const { userId } = getAuth(req);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (!user)
        return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
        );

    const body = await req.json();
    await connectMongoDB();

    const allowed = (({
        title,
        description,
        images,
        price,
        medium,
        year,
        dimensions,
        isFramed,
        location,
        tags,
        category,
    }) => ({
        title,
        description,
        images,
        price,
        medium,
        year,
        dimensions,
        isFramed,
        location,
        tags,
        category,
    }))(body);

    const product = await Product.create({
        ...allowed,
        artist: userId,
        artistName:
            user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username ||
                  user.emailAddresses[0]?.emailAddress ||
                  "Unknown Artist",
    });

    const productCount = await Product.countDocuments({ artist: userId });

    if (productCount >= 3) {
        await User.findOneAndUpdate({ clerkId: userId }, { isVerified: true });
    }

    return NextResponse.json(product, { status: 201 });
}
