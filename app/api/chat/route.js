import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "@/models/user";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";
import Story from "@/models/story";
import { getAuth } from "@clerk/nextjs/server";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    const { message } = await req.json();
    const { userId } = getAuth(req);
    await connectMongoDB();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findOne({ id: userId });
    const products = await Product.find({ artist: userId }).limit(5).lean();
    const stories = await Story.find({ artist: userId }).limit(5).lean();
    let details = JSON.stringify({ user, products, stories });

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
    });

    const streamingResp = await model.generateContentStream({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `You are Colora, a friendly AI creative assistant on platform called Arise which is a platform to preserver, promote Indian folk artforms likeWarli , Pithora, Madhubani and much more), you help artists to boost their content for better reach and inspire them, you need to give tips to them based on their profile and previous works, you'll be given a few details of the current artist's previous works if not given then the user is new. Always answer in Markdown format with helpful, structured explanations. Respond is as human way as possible, give sleek, concise and efficient responses. user details: ${details}`,
                    },
                ],
            },
            {
                role: "user",
                parts: [{ text: message }],
            },
        ],
    });

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of streamingResp.stream) {
                const text = chunk.text();
                if (text) {
                    controller.enqueue(new TextEncoder().encode(text));
                }
            }
            controller.close();
        },
    });

    return new NextResponse(stream);
}
