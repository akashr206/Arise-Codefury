import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
    const { message } = await req.json();

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
    });

    const streamingResp = await model.generateContentStream(message);

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
