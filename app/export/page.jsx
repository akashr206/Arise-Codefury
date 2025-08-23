"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

const complianceChecks = [
    { id: "safety", label: "Safety Certificate", type: "certificate" },
    { id: "origin", label: "Certificate of Origin", type: "certificate" },
    {
        id: "packaging",
        label: "Proper Packaging (eco-friendly & durable)",
        type: "check",
    },
    {
        id: "labeling",
        label: "Correct Labeling (language, material, country)",
        type: "check",
    },
    {
        id: "customs",
        label: "Customs Declaration Form Prepared",
        type: "check",
    },
    {
        id: "insurance",
        label: "Product Insurance (upload insurance proof)",
        type: "certificate",
    },
];

export default function ExportReady() {
    const [products, setProducts] = useState([]);
    const [pendingProducts, setPendingProducts] = useState([]);
    const [exportedProducts, setExportedProducts] = useState([]);
    const [selected, setSelected] = useState(null);
    const [compliance, setCompliance] = useState({});
    const [uploads, setUploads] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [exportData, setExportData] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`/api/products/my`);
                const data = await res.json();

                // Check export status for each product
                const checks = await Promise.all(
                    data.map(async (p) => {
                        const r = await fetch(`/api/export/${p._id}`);
                        const status = await r.json();
                        return { ...p, exported: status.eligible };
                    })
                );

                setProducts(checks);
                setPendingProducts(checks.filter((p) => !p.exported));
                setExportedProducts(checks.filter((p) => p.exported));
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        if (user) fetchProducts();
    }, [user]);

    async function uploadToCloudinary(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
        );
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

        const res = await fetch(uploadUrl, { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");
        return data.secure_url;
    }

    const handleUpload = async (e, id) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            setUploads((prev) => ({ ...prev, [id]: "uploading" }));
            const url = await uploadToCloudinary(file);
            setUploads((prev) => ({ ...prev, [id]: url }));
        } catch (error) {
            setUploads((prev) => ({ ...prev, [id]: undefined }));
            alert(error.message || "Upload failed");
        }
    };

    const openProductDialog = async (product) => {
        setSelectedProduct(product);
        setSelected(product._id);
        setDialogOpen(true);

        try {
            const res = await fetch(`/api/export/${product._id}`);
            const data = await res.json();
            setExportData(data);
        } catch (error) {
            console.error("Failed to fetch export details:", error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedProduct) return;
        try {
            const payload = {
                productId: selectedProduct._id,
                compliance,
                uploads,
            };

            const res = await fetch("/api/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to submit compliance");
            alert("✅ Compliance submitted successfully!");
            setDialogOpen(false);
            setCompliance({});
            setUploads({});
        } catch (error) {
            console.error(error);
            alert(error.message || "Submission failed");
        }
    };

    const allChecked = complianceChecks.every((c) => compliance[c.id]);
    const allUploadsDone = complianceChecks
        .filter((c) => c.type === "certificate")
        .every((c) => uploads[c.id] && uploads[c.id] !== "uploading");

    const canSubmit = allChecked && allUploadsDone;

    return (
        <div className="p-6 space-y-8 mt-16 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Export Compliance Dashboard</h1>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Products Pending Export</CardTitle>
                    <CardDescription>
                        Select a product to complete compliance requirements
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pendingProducts.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No pending products 🎉
                        </p>
                    )}
                    {pendingProducts.map((product) => (
                        <div
                            key={product._id}
                            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                                selected === product._id
                                    ? "bg-blue-50 border-blue-300"
                                    : ""
                            }`}
                            onClick={() => openProductDialog(product)}
                        >
                            <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                                <img
                                    src={
                                        product.images[0] ||
                                        "/api/placeholder/80/80"
                                    }
                                    alt={product.title}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    by {product.artistName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">₹{product.price}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                >
                                    Make Export Ready
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Already Export Ready</CardTitle>
                    <CardDescription>
                        These products have already completed export compliance
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {exportedProducts.length === 0 && (
                        <p className="text-sm text-gray-500">
                            No exported products yet.
                        </p>
                    )}
                    {exportedProducts.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center p-4 border rounded-lg bg-green-50 border-green-300 cursor-pointer hover:bg-green-100"
                            onClick={() => openProductDialog(product)}
                        >
                            <div className="relative h-16 w-16 rounded-md overflow-hidden mr-4">
                                <img
                                    src={
                                        product.images[0] ||
                                        "/api/placeholder/80/80"
                                    }
                                    alt={product.title}
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    by {product.artistName}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">₹{product.price}</p>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="mt-2"
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-xl mt-10">
                    <DialogHeader>
                        <DialogTitle>{selectedProduct?.title}</DialogTitle>
                    </DialogHeader>

                    {exportData?.eligible ? (
                        <Card className="shadow-none border-none p-0">
                            <CardHeader className={"p-0"}>
                                <CardTitle>Export Documentation</CardTitle>
                                <CardDescription>
                                    This product has already been marked export
                                    ready
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {exportData.exports.map((exp, idx) => (
                                    <div key={idx}>
                                        <ul className="list-disc list-inside text-sm text-gray-700">
                                            {Object.entries(exp.compliance).map(
                                                ([key, val]) => (
                                                    <li key={key}>
                                                        {key
                                                            .charAt(0)
                                                            .toLocaleUpperCase() +
                                                            key.slice(1)}
                                                        :{" "}
                                                        {val
                                                            ? "✅ Yes"
                                                            : "❌ No"}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                        {exp.uploads &&
                                            Object.entries(exp.uploads).map(
                                                ([key, url]) => (
                                                    <div
                                                        key={key}
                                                        className="mt-1"
                                                    >
                                                        <span className="font-semibold">
                                                            {key
                                                                .charAt(0)
                                                                .toLocaleUpperCase() +
                                                                key.slice(
                                                                    1
                                                                )}{" "}
                                                            Certificate :
                                                        </span>{" "}
                                                        <a
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 underline"
                                                        >
                                                            View File
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>
                                    Export Compliance Checklist
                                </CardTitle>
                                <CardDescription>
                                    Complete these requirements to ensure your
                                    product is export ready
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {complianceChecks.map((item) => (
                                    <div key={item.id} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={
                                                    compliance[item.id] || false
                                                }
                                                onCheckedChange={(checked) =>
                                                    setCompliance((prev) => ({
                                                        ...prev,
                                                        [item.id]: checked,
                                                    }))
                                                }
                                            />
                                            <Label
                                                htmlFor={item.id}
                                                className="cursor-pointer"
                                            >
                                                {item.label}
                                            </Label>
                                        </div>

                                        {item.type === "certificate" &&
                                            compliance[item.id] && (
                                                <div className="pl-6">
                                                    <Input
                                                        type="file"
                                                        accept="image/*,.pdf"
                                                        onChange={(e) =>
                                                            handleUpload(
                                                                e,
                                                                item.id
                                                            )
                                                        }
                                                        className="max-w-md"
                                                    />
                                                </div>
                                            )}

                                        {uploads[item.id] === "uploading" && (
                                            <p className="text-sm text-blue-600 pl-6">
                                                Uploading...
                                            </p>
                                        )}
                                        {uploads[item.id] &&
                                            uploads[item.id] !==
                                                "uploading" && (
                                                <p className="text-sm text-green-600 pl-6">
                                                    ✅ Uploaded successfully
                                                </p>
                                            )}
                                    </div>
                                ))}

                                <div className="pt-4 mt-4 border-t">
                                    <Button
                                        className="w-full"
                                        onClick={handleSubmit}
                                        disabled={!canSubmit}
                                    >
                                        Submit Compliance Documentation
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
