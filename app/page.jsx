import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import ImageBasedIndia from "@/components/landing/ImageBasedIndia";
import About from "@/components/landing/About";
import Footer from "@/components/landing/Footer";

export default function page() {
    return (
        <div className="flex flex-col mt-22">
            <HeroSection />
            <ImageBasedIndia />
            <About />
            <Footer />
        </div>
    );
}
