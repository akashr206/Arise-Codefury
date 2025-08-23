import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/user";

export async function GET(req, { params }) {
    const { id } = await params;
    await connectMongoDB();
    let product = await Product.findById(id);
    const userId = product?.artist;
    const author = await User.findOne({ id: userId }).lean();
    const newP = {
        ...product._doc,
        artistName: author?.name || "Unknown",
        artistProfile: author?.profile || null,
        artistUsername: author?.username || "user",
        artistVerified: author?.isVerified || false,
        artistLocation: author?.location || "",
    };

    if (!product)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(newP);
}

export async function PATCH(req, { params }) {
    const { id } = await params;
    const { userId } = getAuth(req);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const updates = await req.json();
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
    }))(updates);

    const product = await Product.findOneAndUpdate(
        { _id: id, artist: userId },
        allowed,
        { new: true }
    );
    if (!product)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    const { userId } = getAuth(req);
    if (!userId)
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectMongoDB();
    const product = await Product.findOneAndDelete({ _id: id, artist: userId });
    if (!product)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
}
