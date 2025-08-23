"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ExportDetailsDoc({
    open,
    onOpenChange,
    product = {},
    compliance = {},
    uploads = {},
}) {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Export Details Document</DialogTitle>
                    <DialogDescription>
                        Review compliance status & submitted certificates for{" "}
                        <b>{product?.title}</b>
                    </DialogDescription>
                </DialogHeader>

                <Card className={"border-none shadow-none p-0"}>
                    <CardHeader>
                        <CardTitle>Compliance Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(compliance).map((key) => (
                            <div
                                key={key}
                                className="flex items-center justify-between border-b pb-2"
                            >
                                <p className="font-medium capitalize">{key}</p>

                                {compliance[key] ? (
                                    uploads[key] ? (
                                        <div className="flex items-center gap-2">
                                            <Badge variant="success">
                                                Done
                                            </Badge>
                                            <a
                                                href={uploads[key]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-sm"
                                            >
                                                View Doc
                                            </a>
                                        </div>
                                    ) : (
                                        <Badge variant="success">Checked</Badge>
                                    )
                                ) : (
                                    <Badge variant="destructive">
                                        Not Done
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="pt-4">
                    <Button
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
