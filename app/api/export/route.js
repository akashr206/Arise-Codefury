import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { connectMongoDB } from "@/lib/db";
import Export from "@/models/export";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { productId, compliance, uploads } = body;
        
        if (!productId || !compliance || !uploads) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const exportEntry = await Export.create({
            productId,
            userId,
            compliance,
            uploads,
        });

        return NextResponse.json(exportEntry, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function GET(req){
    
}
