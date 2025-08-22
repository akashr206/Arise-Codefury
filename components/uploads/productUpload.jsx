"use client";

import { useState, useRef } from "react";
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
import { Upload, X, Image, Plus, Palette } from "lucide-react";

export default function ProductUploadDialog({ open, onClose }) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        medium: "",
        year: "",
        location: "",
        category: "",
        isFramed: false,
        dimensions: {
            width: "",
            height: "",
            depth: "",
            unit: "cm",
        },
    });
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const validFiles = Array.from(selectedFiles).filter((file) =>
            file.type.startsWith("image/")
        );

        if (validFiles.length === 0) {
            alert("Please select image files only");
            return;
        }

        setFiles(validFiles);

        const newPreviews = [];
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPreviews.push(e.target.result);
                if (newPreviews.length === validFiles.length) {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
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

        const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith("image/")
        );
        if (droppedFiles.length > 0) {
            handleFileSelect(droppedFiles);
        }
    };

    const removeImage = (index) => {
        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setFiles(newFiles);
        setPreviews(newPreviews);
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

    const handleInputChange = (field, value) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
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
        if (files.length === 0) {
            alert("Please select at least one image");
            return;
        }

        if (
            !formData.title ||
            !formData.description ||
            !formData.price
        ) {
            alert(
                "Please fill in all required fields (Title, Description, Price)"
            );
            return;
        }

        setUploading(true);
        const progressInterval = simulateProgress();

        try {
            const imageUrls = [];
            for (const file of files) {
                const formDataUpload = new FormData();
                formDataUpload.append("file", file);
                formDataUpload.append(
                    "upload_preset",
                    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
                );

                const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
                const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

                const res = await fetch(uploadUrl, {
                    method: "POST",
                    body: formDataUpload,
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error?.message || "Upload failed");
                }

                imageUrls.push(data.secure_url);
            }

            clearInterval(progressInterval);
            setProgress(100);

            const productData = {
                ...formData,
                images: imageUrls,
                tags,
                price: parseFloat(formData.price),
                year: formData.year ? parseInt(formData.year) : undefined,
                dimensions: {
                    ...formData.dimensions,
                    width: formData.dimensions.width
                        ? parseFloat(formData.dimensions.width)
                        : undefined,
                    height: formData.dimensions.height
                        ? parseFloat(formData.dimensions.height)
                        : undefined,
                    depth: formData.dimensions.depth
                        ? parseFloat(formData.dimensions.depth)
                        : undefined,
                },
            };

            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create product");
            }

            resetForm();
            onClose();
        } catch (error) {
            clearInterval(progressInterval);
            alert(error.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setFiles([]);
        setPreviews([]);
        setFormData({
            title: "",
            description: "",
            price: "",
            medium: "",
            year: "",
            location: "",
            category: "",
            isFramed: false,
            dimensions: {
                width: "",
                height: "",
                depth: "",
                unit: "cm",
            },
        });
        setTags([]);
        setTagInput("");
        setProgress(0);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg">
                    <Palette className="w-4 h-4 mr-2" />
                    Add Artwork
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Add New Artwork
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Images *
                        </label>
                        {previews.length === 0 ? (
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
                                            Drop your images here
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            or click to browse • Multiple images
                                            supported
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        handleFileSelect(e.target.files)
                                    }
                                    className="hidden"
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {previews.map((preview, index) => (
                                        <div
                                            key={index}
                                            className="relative rounded-lg overflow-hidden bg-gray-100"
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="w-full border-dashed"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add More Images
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                        handleFileSelect(
                                            Array.from(e.target.files)
                                        )
                                    }
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Title *
                            </label>
                            <Input
                                placeholder="Enter artwork title"
                                value={formData.title}
                                onChange={(e) =>
                                    handleInputChange("title", e.target.value)
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Price * (₹)
                            </label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) =>
                                    handleInputChange("price", e.target.value)
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Description *
                        </label>
                        <Textarea
                            placeholder="Describe the artwork..."
                            value={formData.description}
                            onChange={(e) =>
                                handleInputChange("description", e.target.value)
                            }
                            className="min-h-20 resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                        />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Medium
                            </label>
                            <Input
                                placeholder="Oil on canvas, Watercolor..."
                                value={formData.medium}
                                onChange={(e) =>
                                    handleInputChange("medium", e.target.value)
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Year
                            </label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="2024"
                                value={formData.year}
                                onChange={(e) =>
                                    handleInputChange("year", e.target.value)
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <Input
                                placeholder="Painting, Sculpture..."
                                value={formData.category}
                                onChange={(e) =>
                                    handleInputChange(
                                        "category",
                                        e.target.value
                                    )
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Dimensions
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="Width"
                                value={formData.dimensions.width}
                                onChange={(e) =>
                                    handleInputChange(
                                        "dimensions.width",
                                        e.target.value
                                    )
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                            <Input
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="Height"
                                value={formData.dimensions.height}
                                onChange={(e) =>
                                    handleInputChange(
                                        "dimensions.height",
                                        e.target.value
                                    )
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                            <Input
                                type="number"
                                min="0"
                                step="0.1"
                                placeholder="Depth"
                                value={formData.dimensions.depth}
                                onChange={(e) =>
                                    handleInputChange(
                                        "dimensions.depth",
                                        e.target.value
                                    )
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                            <select
                                value={formData.dimensions.unit}
                                onChange={(e) =>
                                    handleInputChange(
                                        "dimensions.unit",
                                        e.target.value
                                    )
                                }
                                className="px-3 py-2 border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                                <option value="mm">mm</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <Input
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={(e) =>
                                    handleInputChange(
                                        "location",
                                        e.target.value
                                    )
                                }
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Framing
                            </label>
                            <div className="flex items-center space-x-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isFramed"
                                    checked={formData.isFramed}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "isFramed",
                                            e.target.checked
                                        )
                                    }
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="isFramed"
                                    className="text-sm text-gray-700"
                                >
                                    This artwork is framed
                                </label>
                            </div>
                        </div>
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

                    {uploading && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    Uploading artwork...
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

                <DialogFooter className="pt-6 border-t border-gray-100">
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
                        disabled={
                            files.length === 0 ||
                            uploading ||
                            !formData.title ||
                            !formData.description ||
                            !formData.price
                        }
                        className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Publishing...</span>
                            </div>
                        ) : (
                            "Publish Artwork"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
