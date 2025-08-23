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
        const search = searchParams.get("search");
        const tags = searchParams.get("tags");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const medium = searchParams.get("medium");
        const year = searchParams.get("year");

        const sortBy = searchParams.get("sortBy") || "createdAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const query = {};

        if (artist) query.artist = artist;

        if (category && category !== "all") {
            query.category = new RegExp(`^${category}$`, "i");
        }

        if (medium) query.medium = medium;
        if (year) query.year = parseInt(year);

        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            query.$or = [
                { title: searchRegex },
                { artistName: searchRegex },
                { description: searchRegex },
                { tags: { $in: [searchRegex] } },
            ];
        }

        if (tags && tags.trim()) {
            const tagArray = tags.split(",").map((tag) => tag.trim());
            const tagRegexArray = tagArray.map((tag) => new RegExp(tag, "i"));

            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { tags: { $in: tagRegexArray } },
                ];
                delete query.$or;
            } else {
                query.tags = { $in: tagRegexArray };
            }
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        console.log("Query:", JSON.stringify(query, null, 2));
        console.log("Sort:", sort);

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        let products = await Product.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        const artistIds = [
            ...new Set(products.map((p) => p.artist).filter(Boolean)),
        ];

        let artists = [];
        let artistMap = {};

        if (artistIds.length > 0) {
            artists = await User.find({ id: { $in: artistIds } }).lean();

            artistMap = artists.reduce((acc, user) => {
                const key = user.id || user._id.toString();
                acc[key] = user;
                return acc;
            }, {});
        }

        products = products.map((product) => ({
            ...product,
            artistName:
                product.artistName ||
                artistMap[product.artist]?.name ||
                artistMap[product.artist?.toString()]?.name ||
                "Unknown Artist",
            artistProfile:
                artistMap[product.artist]?.profile ||
                artistMap[product.artist?.toString()]?.profile ||
                null,
        }));

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                itemsPerPage: limit,
            },
            filters: {
                search,
                category,
                tags,
                sortBy,
                sortOrder,
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}
