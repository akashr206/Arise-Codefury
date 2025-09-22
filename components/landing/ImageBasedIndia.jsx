"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Map from "./Map";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const stateData = {
    "IN-AP": {
        name: "Andhra Pradesh",
        artForm: "Kalamkari Painting",
        description:
            "Hand-painted or block-printed cotton textiles depicting mythological stories using natural dyes and traditional techniques.",
    },
    "IN-AR": {
        name: "Arunachal Pradesh",
        artForm: "Monpa Woodcarving",
        description:
            "Intricate wooden sculptures and masks created by Monpa tribes, featuring Buddhist motifs and local folklore.",
    },
    "IN-AS": {
        name: "Assam",
        artForm: "Assamese Silk Weaving",
        description:
            "Traditional handloom weaving producing Muga, Eri, and Pat silk textiles with intricate patterns and natural golden sheen.",
    },
    "IN-BR": {
        name: "Bihar",
        artForm: "Madhubani Painting",
        description:
            "Vibrant folk art from Mithila region featuring mythological themes, traditionally painted by women on walls and floors.",
    },
    "IN-CH": {
        name: "Chhattisgarh",
        artForm: "Bastar Iron Craft",
        description:
            "Ancient lost-wax casting technique creating intricate iron sculptures and decorative items by tribal artisans.",
    },
    "IN-CT": {
        name: "Chhattisgarh",
        artForm: "Bastar Iron Craft",
        description:
            "Traditional craft of the Bastar tribes using the ancient lost-wax casting technique to create intricate iron sculptures, tools, and decorative items that reflect tribal myths and rural life.",
    },

    "IN-DL": {
        name: "Delhi",
        artForm: "Zardozi Embroidery",
        description:
            "Elaborate gold and silver thread embroidery that adorned Mughal courts, now preserved by master craftsmen in Old Delhi.",
    },
    "IN-GA": {
        name: "Goa",
        artForm: "Azulejo Tiles",
        description:
            "Portuguese-influenced decorative ceramic tiles featuring blue and white patterns, adorning churches and heritage buildings.",
    },
    "IN-GJ": {
        name: "Gujarat",
        artForm: "Bandhani Tie-Dye",
        description:
            "Ancient resist-dyeing technique creating intricate patterns through tiny knots, producing vibrant textiles for celebrations.",
    },
    "IN-HR": {
        name: "Haryana",
        artForm: "Haryana Folk Art",
        description:
            "Traditional wall paintings and pottery featuring geometric patterns and rural life themes, reflecting the agricultural heritage.",
    },
    "IN-HP": {
        name: "Himachal Pradesh",
        artForm: "Chamba Rumal Embroidery",
        description:
            "Intricate silk embroidery depicting mythological scenes, traditionally created as gifts for special occasions in the hill regions.",
    },
    "IN-JH": {
        name: "Jharkhand",
        artForm: "Sohrai Art",
        description:
            "Tribal wall paintings celebrating harvest festivals, featuring animals and nature motifs in earthy colors.",
    },
    "IN-JK": {
        name: "Jammu & Kashmir",
        artForm: "Kashmiri Pashmina Weaving",
        description:
            "The finest pashmina shawls are hand-woven from the soft undercoat of Changthangi goats, representing centuries of Kashmiri craftsmanship.",
    },
    "IN-KA": {
        name: "Karnataka",
        artForm: "Mysore Painting",
        description:
            "Classical South Indian painting style featuring Hindu deities with gold leaf work and vibrant natural pigments.",
    },
    "IN-KL": {
        name: "Kerala",
        artForm: "Kathakali Face Painting",
        description:
            "Elaborate facial makeup art for classical dance-drama, using natural pigments to transform performers into mythological characters.",
    },
    "IN-LA": {
        name: "Ladakh",
        artForm: "Tibetan Thangka Painting",
        description:
            "Sacred Buddhist scroll paintings that serve as meditation aids and preserve ancient Tibetan artistic traditions in the high Himalayas.",
    },
    "IN-MP": {
        name: "Madhya Pradesh",
        artForm: "Gond Painting",
        description:
            "Tribal art using dots and lines to create intricate patterns depicting nature, animals, and folklore of central India.",
    },
    "IN-MH": {
        name: "Maharashtra",
        artForm: "Warli Painting",
        description:
            "Tribal art using simple geometric shapes to depict daily life, harvest, and dance, painted in white on mud walls.",
    },
    "IN-MN": {
        name: "Manipur",
        artForm: "Manipuri Pottery",
        description:
            "Traditional ceramic art creating decorative and functional items with distinctive shapes and natural glazes.",
    },
    "IN-ML": {
        name: "Meghalaya",
        artForm: "Khasi Cane Craft",
        description:
            "Traditional cane and bamboo weaving creating functional and decorative items by the Khasi, Jaintia, and Garo tribes.",
    },
    "IN-MZ": {
        name: "Mizoram",
        artForm: "Mizo Bamboo Craft",
        description:
            "Intricate bamboo weaving creating baskets, furniture, and decorative items showcasing sustainable tribal craftsmanship.",
    },
    "IN-NL": {
        name: "Nagaland",
        artForm: "Naga Tribal Weaving",
        description:
            "Traditional handwoven textiles featuring geometric patterns and symbolic motifs representing different Naga tribes.",
    },
    "IN-OR": {
        name: "Odisha",
        artForm: "Pattachitra Painting",
        description:
            "Traditional cloth-based scroll paintings depicting Jagannath and Krishna legends, using natural pigments and fine brushwork.",
    },
    "IN-PB": {
        name: "Punjab",
        artForm: "Phulkari Embroidery",
        description:
            "Vibrant floral embroidery on handspun cloth, traditionally worn by Punjabi women and passed down through generations.",
    },
    "IN-RJ": {
        name: "Rajasthan",
        artForm: "Miniature Painting",
        description:
            "Exquisite small-scale paintings depicting royal courts, religious themes, and romantic tales in vibrant colors.",
    },
    "IN-SK": {
        name: "Sikkim",
        artForm: "Thangka Painting",
        description:
            "Buddhist scroll paintings serving as meditation aids and preserving Himalayan spiritual traditions.",
    },
    "IN-TN": {
        name: "Tamil Nadu",
        artForm: "Tanjore Painting",
        description:
            "Classical South Indian painting featuring Hindu deities with gold foil, gems, and rich colors on wooden panels.",
    },
    "IN-TG": {
        name: "Telangana",
        artForm: "Bidriware",
        description:
            "Metal handicraft using zinc and copper alloy with silver inlay, creating decorative items with distinctive black finish.",
    },
    "IN-TR": {
        name: "Tripura",
        artForm: "Tripuri Handloom",
        description:
            "Traditional textile weaving featuring geometric patterns and vibrant colors, reflecting the cultural heritage of Tripuri people.",
    },
    "IN-UP": {
        name: "Uttar Pradesh",
        artForm: "Chikankari Embroidery",
        description:
            "Delicate white-on-white embroidery from Lucknow, featuring intricate floral patterns that epitomize Mughal elegance.",
    },
    "IN-UK": {
        name: "Uttarakhand",
        artForm: "Aipan Art",
        description:
            "Sacred geometric floor and wall paintings using rice paste and red ochre, created during festivals and religious ceremonies.",
    },
    "IN-WB": {
        name: "West Bengal",
        artForm: "Kantha Embroidery",
        description:
            "Running stitch embroidery on layered cloth, creating beautiful quilts and garments with storytelling motifs.",
    },
};

export default function IndiaArtMap() {
    const [selectedState, setSelectedState] = useState(null);
    const [hoveredState, setHoveredState] = useState(null);

    const closeModal = () => setSelectedState(null);

    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* Header */}
            <div className="p-2 sm:p-4">
                <h1 className="text-3xl my-4 uppercase font-bold text-center">
                    Traditional Art Forms of India
                </h1>
            </div>

            <div className="flex w-full overflow-hidden h-full">
                <div className="w-full h-full">
                    <Map
                        setHoveredState={setHoveredState}
                        setSelectedState={setSelectedState}
                    />
                </div>

                {/* Tooltip on hover */}
                {hoveredState && !selectedState && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-30 pointer-events-none">
                        <p className="font-semibold">
                            {stateData[hoveredState]?.name}
                        </p>
                        <p className="text-xs opacity-90">
                            {stateData[hoveredState]?.artForm}
                        </p>
                    </div>
                )}
            </div>

            {/* Shadcn Dialog */}
            <Dialog open={!!selectedState} onOpenChange={closeModal}>
                <DialogContent className="max-w-lg md:max-w-xl lg:max-w-2xl">
                    {selectedState && stateData[selectedState] && (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    {stateData[selectedState].name}
                                </DialogTitle>
                                <DialogDescription>
                                    {stateData[selectedState].artForm}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Visual Representation */}
                            <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white my-4">
                                <div className="text-center px-4">
                                    <div className="text-5xl mb-4">🎨</div>
                                    <div className="text-lg sm:text-xl font-bold leading-tight">
                                        {stateData[selectedState].artForm}
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">
                                    About {stateData[selectedState].artForm}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                    {stateData[selectedState].description}
                                </p>
                            </div>

                            {/* Meta info */}
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    Traditional art form from{" "}
                                    <strong>
                                        {stateData[selectedState].name}
                                    </strong>
                                </p>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Bottom Info Box */}
            <div
                className={`
          absolute z-10 
          bottom-2 sm:bottom-4 
          left-2 sm:left-4 
          right-2 sm:right-auto
          p-3 sm:p-4 
          rounded-lg shadow-lg 
          max-w-full sm:max-w-xs
          bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-200
          ${selectedState ? "hidden sm:block" : "block"}
        `}
            >
                <h4 className="font-semibold mb-2 text-sm sm:text-base">
                    How to explore
                </h4>
                <div className="space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        <span>Hover over states to preview</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                        <span>Click to explore art forms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
