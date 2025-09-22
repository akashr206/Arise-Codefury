"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ExportDetailsDoc from "../exports/exportDialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogTitle,
    DialogTrigger,
    DialogContent,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import {
    Heart,
    Share2,
    Star,
    MapPin,
    Calendar,
    Palette,
    Ruler,
    MessageCircle,
    ArrowLeft,
    Sparkles,
    Eye,
    Brush,
    Camera,
    ArrowUpRight,
    BadgeCheck,
    Instagram,
    Twitter,
    Mail,
} from "lucide-react";

export default function Artwork({ artwork }) {
    const [isLoved, setIsLoved] = useState(false);
    const [isZooming, setIsZooming] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [details, setDetails] = useState(null);
    const [artistDetails, setArtistDetails] = useState({});
    const [openArtist, setOpenArtist] = useState(false);
    const router = useRouter();

    const handleMouseEnter = () => {
        setIsZooming(true);
    };

    const handleMouseLeave = () => {
        setIsZooming(false);
    };

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    async function fetchDetails() {
        const res = await fetch(`/api/export/${artwork._id}`);
        const data = await res.json();
        console.log(artwork);

        setDetails(data);
    }
    async function fetchArtist() {
        const res = await fetch(`/api/users/${artwork.artist}`);
        const data = await res.json();
        setArtistDetails(data);
    }
    useEffect(() => {
        fetchDetails();
        fetchArtist();
    }, []);

    const product = artwork;

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Artwork Not Found
                    </h1>
                    <p className="text-gray-600">
                        The artwork you're looking for doesn't exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-20 bg-gradient-to-br from-background via-card to-background">
            <Dialog open={openArtist} onOpenChange={setOpenArtist}>
                <DialogContent className="max-w-sm rounded-2xl p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        <img
                            src={artistDetails?.profile}
                            alt="artist"
                            className="h-24 w-24 rounded-full object-cover shadow-md"
                        />

                        <div>
                            <h2 className="text-lg font-semibold">
                                {artistDetails?.name || "Unknown Artist"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {artistDetails?.bio || "No bio available"}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`https://instagram.com/${artistDetails?.instagram}`}
                                target="_blank"
                            >
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    <Instagram className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={`mailto:${artistDetails?.email}`}>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    <Mail className="h-5 w-5" />
                                </Button>
                            </Link>
                            <Link
                                href={`https://twitter.com/${artistDetails?.twitter}`}
                                target="_blank"
                            >
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    <Twitter className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-primary/20">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Back to Gallery</span>
                    </Button>
                </div>
            </div>
            <ExportDetailsDoc
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={details?.exports[0]?.product}
                compliance={details?.exports[0]?.compliance}
                uploads={details?.exports[0]?.uploads}
            ></ExportDetailsDoc>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="sticky top-24 h-fit">
                        <div className="space-y-6">
                            <div className="relative group">
                                <div
                                    className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 shadow-2xl hover:shadow-primary/20 transition-all duration-500 float-animation cursor-zoom-in"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    onMouseMove={handleMouseMove}
                                >
                                    <img
                                        src={
                                            product.images?.[
                                                selectedImageIndex
                                            ] || "/placeholder.svg"
                                        }
                                        alt={product.title}
                                        className="w-full h-full object-cover duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {isZooming && (
                                        <div
                                            className="absolute w-32 h-32 border-2 border-primary/60 rounded-full pointer-events-none bg-white/10 backdrop-blur-sm shadow-lg"
                                            style={{
                                                left: mousePosition.x - 64,
                                                top: mousePosition.y - 64,
                                                transform: "translate(0, 0)",
                                            }}
                                        />
                                    )}
                                </div>

                                {isZooming && (
                                    <div className="absolute top-0 left-full ml-4 w-64 h-64  z-[9999] rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                                        <div
                                            className="w-full h-full bg-cover bg-no-repeat"
                                            style={{
                                                backgroundImage: `url(${
                                                    product.images?.[
                                                        selectedImageIndex
                                                    ] || "/placeholder.svg"
                                                })`,
                                                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                                backgroundSize: "600%",
                                            }}
                                        />
                                        <div className="absolute inset-0 border border-primary/30 rounded-2xl" />
                                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Zoom View
                                        </div>
                                    </div>
                                )}
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setSelectedImageIndex(index)
                                            }
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                                                selectedImageIndex === index
                                                    ? "border-primary shadow-lg shadow-primary/20"
                                                    : "border-transparent hover:border-primary/50"
                                            }`}
                                        >
                                            <img
                                                src={
                                                    image || "/placeholder.svg"
                                                }
                                                alt={`${product.title} view ${
                                                    index + 1
                                                }`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    {selectedImageIndex === 0 && "Main View"}
                                    {selectedImageIndex === 1 &&
                                        "Detail Close-up"}
                                    {selectedImageIndex === 2 &&
                                        "Additional View"}
                                    {selectedImageIndex === 3 &&
                                        "Studio Setting"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary border-primary/20"
                                >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Original Creation
                                </Badge>
                                {product.tags?.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                                {product.title}
                            </h1>

                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-400" />
                                    <span>{product.favorites || 0} loves</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    <span>{product.favorites || 0} views</span>
                                </div>
                            </div>
                        </div>

                        <Card className="border-primary/20 shadow-lg hover:shadow-primary/10 transition-all duration-300 glow-effect">
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 border-2 overflow-hidden rounded-full border-primary/20">
                                        {product.artistProfile && (
                                            <Link href={`/profile/${product.artistUsername}`}>
                                                <img
                                                    src={
                                                        product.artistProfile ||
                                                        "/placeholder.svg"
                                                    }
                                                />
                                            </Link>
                                        )}
                                        <div className="bg-primary/10 text-primary">
                                            {product.artistName
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("") || "A"}
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold">
                                                {product.artistName ||
                                                    "Unknown Artist"}
                                            </h3>
                                            {product.artistVerified && (
                                                <div title={"Verified Artist"}>
                                                    <BadgeCheck className="w-5 h-5 text-blue-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>
                                                    {product.artistLocation ||
                                                        "Unknown Location"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <div className="bg-card/50 rounded-xl p-6 border border-primary/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Price
                                        </p>
                                        <p className="text-3xl font-bold text-foreground">
                                            ₹
                                            {product.price?.toLocaleString() ||
                                                "Contact for price"}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setOpenArtist(true)}
                                        size="lg"
                                        className="bg-gradient-to-r  from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                    >
                                        Contact Artist{" "}
                                        <ArrowUpRight className="inline w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>

                            {product.description && (
                                <Card className="border-primary/20 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-primary">
                                            About This Artwork
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed text-lg">
                                            {product.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                            {details?.eligible && (
                                <Card className="border-primary/20 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between gap-2 text-primary">
                                            <div className="flex gap-2 items-center text-green-500">
                                                Export ready <Check></Check>
                                            </div>
                                            <Button
                                                onClick={() =>
                                                    setDialogOpen(true)
                                                }
                                                variant="outline"
                                            >
                                                View Details
                                            </Button>
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                {product.medium && (
                                    <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Palette className="w-4 h-4 " />
                                            <span className="font-medium text-sm">
                                                Medium
                                            </span>
                                        </div>
                                        <p className="text-foreground">
                                            {product.medium}
                                        </p>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Ruler className="w-4 h-4 " />
                                            <span className="font-medium text-sm">
                                                Dimensions
                                            </span>
                                        </div>
                                        <p className="text-foreground">
                                            {product.dimensions.width} ×{" "}
                                            {product.dimensions.height}
                                            {product.dimensions.depth &&
                                                ` × ${product.dimensions.depth}`}{" "}
                                            {product.dimensions.unit}
                                        </p>
                                    </div>
                                )}
                                {product.year && (
                                    <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium text-sm">
                                                Created
                                            </span>
                                        </div>
                                        <p className="text-foreground">
                                            {product.year}
                                        </p>
                                    </div>
                                )}
                                {product.category && (
                                    <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Brush className="w-4 h-4" />
                                            <span className="font-medium text-sm">
                                                Category
                                            </span>
                                        </div>
                                        <p className="text-foreground">
                                            {product.category}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <Button
                                        size="lg"
                                        className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105"
                                        onClick={() => setIsLoved(!isLoved)}
                                    >
                                        <Heart
                                            className={`w-4 h-4 mr-2 ${
                                                isLoved ? "fill-white" : ""
                                            }`}
                                        />
                                        {isLoved ? "Loved!" : "Love This Art"}
                                    </Button>
                                </div>
                                <Link
                                    href={`/profile/${artistDetails.username}`}
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className={"w-full"}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Connect with Artist
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
