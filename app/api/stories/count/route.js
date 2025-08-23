import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";
import Story from "@/models/story";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
    const { userId } = getAuth(req);

    const pCount = await Product.countDocuments({ artist: userId });
    const sCount = await Story.countDocuments({ author: userId });

    const sum = [pCount, sCount];
    return NextResponse.json(sum);
}
