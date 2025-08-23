import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Export from "@/models/export";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await connectMongoDB();
        const count = await Export.countDocuments({ productId: id });
        const exports = await Export.find({ productId: id });
        return NextResponse.json({ eligible: count > 0, exports });
    } catch (error) {}
}
