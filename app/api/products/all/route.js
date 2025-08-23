import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";
import User from "@/models/user";

export async function GET(req) {
    try {
        await connectMongoDB();
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        const artist = searchParams.get("artist");
        const category = searchParams.get("category");
        const tags = searchParams.get("tags");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const medium = searchParams.get("medium");
        const year = searchParams.get("year");

        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const query = {};
        if (artist) query.artist = artist;
        if (category) query.category = category;
        if (medium) query.medium = medium;
        if (year) query.year = parseInt(year);
        if (tags) {
            const tagArray = tags.split(",").map((tag) => tag.trim());
            query.tags = { $in: tagArray };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        let products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const artistIds = [...new Set(products.map((p) => p.artist))];

        const artists = await User.find({ id: { $in: artistIds } }).lean();
        const artistMap = artists.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        products = products.map((product) => ({
            ...product,
            artistName:
                product.artistName ||
                artistMap[product.artist]?.name ||
                "Unknown Artist",
            artistProfile: artistMap[product.artist]?.profile || null,
        }));

        return NextResponse.json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
