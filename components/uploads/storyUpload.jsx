"use client";

import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image, Video, Plus } from "lucide-react";

export default function UploadStoryDialog({ open, onClose, show = false }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;

        if (
            !selectedFile.type.startsWith("image/") &&
            !selectedFile.type.startsWith("video/")
        ) {
            alert("Please select an image or video file");
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(selectedFile);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFile = e.dataTransfer.files[0];
        if (
            droppedFile &&
            (droppedFile.type.startsWith("image/") ||
                droppedFile.type.startsWith("video/"))
        ) {
            handleFileSelect(droppedFile);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    useEffect(() => {
        if (open) {
            fetchUserProducts();
        }
    }, [open]);

    const fetchUserProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await fetch("/api/products");
            if (response.ok) {
                const products = await response.json();
                setAvailableProducts(products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const toggleProduct = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        } else if (
            e.key === "Backspace" &&
            tagInput === "" &&
            tags.length > 0
        ) {
            e.preventDefault();
            setTags(tags.slice(0, -1));
        }
    };

    const simulateProgress = () => {
        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress >= 95) {
                clearInterval(interval);
                setProgress(95);
            } else {
                setProgress(currentProgress);
            }
        }, 200);
        return interval;
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        const progressInterval = simulateProgress();

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "upload_preset",
                process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
            );

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

            const res = await fetch(uploadUrl, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            clearInterval(progressInterval);

            if (!res.ok) {
                throw new Error(data.error?.message || "Upload failed");
            }

            setProgress(100);

            const mediaUrl = data.secure_url;
            const mediaType = data.resource_type;

            await fetch("/api/stories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    caption,
                    tags,
                    mediaUrl,
                    mediaType,
                    products: selectedProducts,
                }),
                credentials: "include",
            });

            setFile(null);
            setPreview(null);
            setCaption("");
            setTags([]);
            setTagInput("");
            setProgress(0);
            onClose();
        } catch (error) {
            clearInterval(progressInterval);
            alert(error.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setPreview(null);
        setCaption("");
        setTags([]);
        setTagInput("");
        setSelectedProducts([]);
        setProgress(0);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {show && (
                <DialogTrigger asChild>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Story
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl px-0 max-h-[85vh] mt-12 overflow-y-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <DialogHeader className="pb-4 px-6">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Create Your Story
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 px-6">
                    <div className="relative">
                        {!preview ? (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                                    dragActive
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <Upload className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-900">
                                            Drop your media here
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            or click to browse • Select one file
                                            (Image or Video)
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) =>
                                        handleFileSelect(e.target.files[0])
                                    }
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden bg-black">
                                {file?.type.startsWith("image/") ? (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover"
                                    />
                                ) : (
                                    <video
                                        src={preview}
                                        className="w-full h-64 object-cover"
                                        controls
                                    />
                                )}
                                <button
                                    onClick={resetForm}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                                <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white text-sm bg-black/50 px-2 py-1 rounded-md">
                                    {file?.type.startsWith("image/") ? (
                                        <Image className="w-4 h-4" />
                                    ) : (
                                        <Video className="w-4 h-4" />
                                    )}
                                    <span className="truncate max-w-32">
                                        {file?.name}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 ">
                        <label className="text-sm font-medium text-gray-700">
                            Caption
                        </label>
                        <Textarea
                            placeholder="Share what's on your mind..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="min-h-20 resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                        />
                        <p className="text-xs text-gray-400 text-right">
                            {caption.length}/500
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-12 focus-within:border-blue-400">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1.5 hover:text-gray-900"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder={
                                    tags.length === 0 ? "Add tags..." : ""
                                }
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={addTag}
                                className="flex-1 min-w-20 bg-transparent outline-none text-sm placeholder-gray-400"
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            Press Enter, comma to add tags, or Backspace to
                            remove last tag
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Link Products (Optional)
                        </label>
                        {loadingProducts ? (
                            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                <span className="ml-2 text-sm text-gray-500">
                                    Loading products...
                                </span>
                            </div>
                        ) : availableProducts.length > 0 ? (
                            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                                {availableProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                            selectedProducts.includes(
                                                product._id
                                            )
                                                ? "bg-blue-50 border border-blue-200"
                                                : "hover:bg-gray-50"
                                        }`}
                                        onClick={() =>
                                            toggleProduct(product._id)
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(
                                                product._id
                                            )}
                                            onChange={() =>
                                                toggleProduct(product._id)
                                            }
                                            className="mr-3"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                ${product.price} •{" "}
                                                {product.medium || "Art"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-500">
                                    No products found. Create products first to
                                    link them to your story.
                                </p>
                            </div>
                        )}
                        {selectedProducts.length > 0 && (
                            <p className="text-xs text-blue-600">
                                {selectedProducts.length} product
                                {selectedProducts.length !== 1 ? "s" : ""}{" "}
                                selected
                            </p>
                        )}
                    </div>

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Uploading your story...
                                </span>
                                <span className="font-medium text-blue-600">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress
                                value={progress}
                                className="h-2 bg-gray-100"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-6 border-t px-6 border-gray-100">
                    <Button
                        variant="outline"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        disabled={uploading}
                        className="border-gray-200 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Sharing...</span>
                            </div>
                        ) : (
                            "Share Story"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
