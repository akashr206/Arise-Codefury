"use client";
import UploadStoryDialog from "@/app/components/uploads/storyUpload";
import ProductUploadDialog from "@/app/components/uploads/productUpload";
const page = () => {
    return (
        <div className="w-screen h-screen items-center justify-center flex">
            <UploadStoryDialog></UploadStoryDialog>
            <ProductUploadDialog></ProductUploadDialog>
        </div>
    );
};

export default page;
