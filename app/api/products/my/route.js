import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";


export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectMongoDB();

        const products = await Product.find({ artist: userId }).sort({
            createdAt: -1,
        });

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching user's products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}