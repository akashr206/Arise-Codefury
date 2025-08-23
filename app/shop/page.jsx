"use client";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("createdAt");
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
                sortBy,
            });

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (category && category !== "all") {
                params.append("category", category);
            }

            console.log("Fetching with params:", params.toString());

            const res = await fetch(`/api/products/all?${params.toString()}`);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            if (data.success) {
                setProducts(data.products || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                throw new Error(data.message || "Failed to fetch products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            setError(err.message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, category, sortBy, search]);

    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        }
    }, [search, category, sortBy]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
    };

    const handleSortChange = (value) => {
        setSortBy(value);
    };

    return (
        <div className="max-w-[1200px] mt-20 mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Art Shop</h1>
                <p className="text-muted-foreground">
                    Discover amazing artworks from talented artists
                </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by title, artist, or tags..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>

                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="digital">Digital</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="createdAt">Newest First</SelectItem>
                        <SelectItem value="price">
                            Price: Low to High
                        </SelectItem>
                        <SelectItem value="favorites">Most Popular</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                    {loading
                        ? "Loading..."
                        : `Showing ${products.length} products`}
                    {search && ` for "${search}"`}
                    {category !== "all" && ` in ${category}`}
                </p>
                {(search || category !== "all") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearch("");
                            setCategory("all");
                        }}
                    >
                        Clear filters
                    </Button>
                )}
            </div>

            {error && (
                <Card className="mb-6 border-destructive">
                    <CardContent className="pt-6">
                        <div className="flex items-center">
                            <div className="text-destructive text-sm">
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-2xl mb-4" />
                    <p className="text-muted-foreground">Loading products</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🎨</div>
                            <h3 className="text-xl font-semibold mb-2">
                                No products found
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("all");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <Card
                                    key={product._id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <CardHeader className="p-0">
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/300x300/f0f0f0/999?text=No+Image";
                                                }}
                                            />
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4">
                                        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            by {product.artistName}
                                        </p>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {product.tags &&
                                                product.tags
                                                    .slice(0, 2)
                                                    .map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                            {product.tags &&
                                                product.tags.length > 2 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +
                                                        {product.tags.length -
                                                            2}{" "}
                                                        more
                                                    </span>
                                                )}
                                        </div>

                                        <div className="text-lg font-bold mb-2">
                                            ₹{product.price.toFixed(2)}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
    
                                        <Link
                                            href={`/artworks/${product._id}`}
                                            size="sm"
                                        >
                                            {" "}
                                            <Button>View</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <div className="flex items-center px-4 py-2 text-sm text-muted-foreground">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    setPage((p) => Math.min(p + 1, totalPages))
                                }
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
