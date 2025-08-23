import { NextResponse } from "next/server";
import { auth, getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";

export async function GET(req, { params }) {
    const { id } = await params;
    await connectMongoDB();
    const product = await Product.findById(id);
    if (!product)
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
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
