"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

const stateData = {
  "jammu-kashmir": {
    name: "Jammu & Kashmir",
    artForm: "Kashmiri Pashmina Weaving",
    description:
      "The finest pashmina shawls are hand-woven from the soft undercoat of Changthangi goats, representing centuries of Kashmiri craftsmanship.",
  },
  ladakh: {
    name: "Ladakh",
    artForm: "Tibetan Thangka Painting",
    description:
      "Sacred Buddhist scroll paintings that serve as meditation aids and preserve ancient Tibetan artistic traditions in the high Himalayas.",
  },
  "himachal-pradesh": {
    name: "Himachal Pradesh",
    artForm: "Chamba Rumal Embroidery",
    description:
      "Intricate silk embroidery depicting mythological scenes, traditionally created as gifts for special occasions in the hill regions.",
  },
  punjab: {
    name: "Punjab",
    artForm: "Phulkari Embroidery",
    description:
      "Vibrant floral embroidery on handspun cloth, traditionally worn by Punjabi women and passed down through generations.",
  },
  haryana: {
    name: "Haryana",
    artForm: "Haryana Folk Art",
    description:
      "Traditional wall paintings and pottery featuring geometric patterns and rural life themes, reflecting the agricultural heritage.",
  },
  delhi: {
    name: "Delhi",
    artForm: "Zardozi Embroidery",
    description:
      "Elaborate gold and silver thread embroidery that adorned Mughal courts, now preserved by master craftsmen in Old Delhi.",
  },
  uttarakhand: {
    name: "Uttarakhand",
    artForm: "Aipan Art",
    description:
      "Sacred geometric floor and wall paintings using rice paste and red ochre, created during festivals and religious ceremonies.",
  },
  "uttar-pradesh": {
    name: "Uttar Pradesh",
    artForm: "Chikankari Embroidery",
    description:
      "Delicate white-on-white embroidery from Lucknow, featuring intricate floral patterns that epitomize Mughal elegance.",
  },
  bihar: {
    name: "Bihar",
    artForm: "Madhubani Painting",
    description:
      "Vibrant folk art from Mithila region featuring mythological themes, traditionally painted by women on walls and floors.",
  },
  jharkhand: {
    name: "Jharkhand",
    artForm: "Sohrai Art",
    description:
      "Tribal wall paintings celebrating harvest festivals, featuring animals and nature motifs in earthy colors.",
  },
  "west-bengal": {
    name: "West Bengal",
    artForm: "Kantha Embroidery",
    description:
      "Running stitch embroidery on layered cloth, creating beautiful quilts and garments with storytelling motifs.",
  },
  odisha: {
    name: "Odisha",
    artForm: "Pattachitra Painting",
    description:
      "Traditional cloth-based scroll paintings depicting Jagannath and Krishna legends, using natural pigments and fine brushwork.",
  },
  chhattisgarh: {
    name: "Chhattisgarh",
    artForm: "Bastar Iron Craft",
    description:
      "Ancient lost-wax casting technique creating intricate iron sculptures and decorative items by tribal artisans.",
  },
  "madhya-pradesh": {
    name: "Madhya Pradesh",
    artForm: "Gond Painting",
    description:
      "Tribal art using dots and lines to create intricate patterns depicting nature, animals, and folklore of central India.",
  },
  rajasthan: {
    name: "Rajasthan",
    artForm: "Miniature Painting",
    description:
      "Exquisite small-scale paintings depicting royal courts, religious themes, and romantic tales in vibrant colors.",
  },
  gujarat: {
    name: "Gujarat",
    artForm: "Bandhani Tie-Dye",
    description:
      "Ancient resist-dyeing technique creating intricate patterns through tiny knots, producing vibrant textiles for celebrations.",
  },
  maharashtra: {
    name: "Maharashtra",
    artForm: "Warli Painting",
    description:
      "Tribal art using simple geometric shapes to depict daily life, harvest, and dance, painted in white on mud walls.",
  },
  goa: {
    name: "Goa",
    artForm: "Azulejo Tiles",
    description:
      "Portuguese-influenced decorative ceramic tiles featuring blue and white patterns, adorning churches and heritage buildings.",
  },
  karnataka: {
    name: "Karnataka",
    artForm: "Mysore Painting",
    description:
      "Classical South Indian painting style featuring Hindu deities with gold leaf work and vibrant natural pigments.",
  },
  "andhra-pradesh": {
    name: "Andhra Pradesh",
    artForm: "Kalamkari Painting",
    description:
      "Hand-painted or block-printed cotton textiles depicting mythological stories using natural dyes and traditional techniques.",
  },
  telangana: {
    name: "Telangana",
    artForm: "Bidriware",
    description:
      "Metal handicraft using zinc and copper alloy with silver inlay, creating decorative items with distinctive black finish.",
  },
  "tamil-nadu": {
    name: "Tamil Nadu",
    artForm: "Tanjore Painting",
    description:
      "Classical South Indian painting featuring Hindu deities with gold foil, gems, and rich colors on wooden panels.",
  },
  kerala: {
    name: "Kerala",
    artForm: "Kathakali Face Painting",
    description:
      "Elaborate facial makeup art for classical dance-drama, using natural pigments to transform performers into mythological characters.",
  },
  sikkim: {
    name: "Sikkim",
    artForm: "Thangka Painting",
    description: "Buddhist scroll paintings serving as meditation aids and preserving Himalayan spiritual traditions.",
  },
  assam: {
    name: "Assam",
    artForm: "Assamese Silk Weaving",
    description:
      "Traditional handloom weaving producing Muga, Eri, and Pat silk textiles with intricate patterns and natural golden sheen.",
  },
  "arunachal-pradesh": {
    name: "Arunachal Pradesh",
    artForm: "Monpa Woodcarving",
    description:
      "Intricate wooden sculptures and masks created by Monpa tribes, featuring Buddhist motifs and local folklore.",
  },
  nagaland: {
    name: "Nagaland",
    artForm: "Naga Tribal Weaving",
    description:
      "Traditional handwoven textiles featuring geometric patterns and symbolic motifs representing different Naga tribes.",
  },
  manipur: {
    name: "Manipur",
    artForm: "Manipuri Pottery",
    description:
      "Traditional ceramic art creating decorative and functional items with distinctive shapes and natural glazes.",
  },
  mizoram: {
    name: "Mizoram",
    artForm: "Mizo Bamboo Craft",
    description:
      "Intricate bamboo weaving creating baskets, furniture, and decorative items showcasing sustainable tribal craftsmanship.",
  },
  tripura: {
    name: "Tripura",
    artForm: "Tripuri Handloom",
    description:
      "Traditional textile weaving featuring geometric patterns and vibrant colors, reflecting the cultural heritage of Tripuri people.",
  },
  meghalaya: {
    name: "Meghalaya",
    artForm: "Khasi Cane Craft",
    description:
      "Traditional cane and bamboo weaving creating functional and decorative items by the Khasi, Jaintia, and Garo tribes.",
  },
}

const stateAreas = [
  // Jammu & Kashmir (large red area at top)
  { id: "jammu-kashmir", left: "34%", top: "2%", width: "12%", height: "15%" },

  // Himachal Pradesh (yellow, between J&K and other states)
  {
    id: "himachal-pradesh",
    left: "38%",
    top: "16%",
    width: "5%",
    height: "8%",
  },

  // Punjab (yellow-green, left of Himachal)
  { id: "punjab", left: "35%", top: "20%", width: "5%", height: "6%" },

  // Haryana (small cyan area)
  { id: "haryana", left: "36%", top: "26%", width: "5%", height: "5%" },

  // Delhi (tiny blue dot)
  { id: "delhi", left: "35.5%", top: "26%", width: "1.5%", height: "1.5%" },

  // Uttarakhand (purple area to right of Himachal)
  { id: "uttarakhand", left: "42%", top: "21%", width: "5%", height: "7%" },

  // Uttar Pradesh (large green area in center-north)
  { id: "uttar-pradesh", left: "42%", top: "28%", width: "12%", height: "13%" },

  // Bihar (salmon/orange color, east of UP)
  { id: "bihar", left: "53%", top: "35%", width: "9%", height: "8%" },

  // Jharkhand (yellow/gold area below Bihar)
  { id: "jharkhand", left: "55%", top: "43%", width: "5%", height: "8%" },

  // West Bengal (cyan/blue area, far east)
  { id: "west-bengal", left: "60%", top: "42%", width: "7%", height: "10%" },

  // Sikkim (tiny blue area)
  { id: "sikkim", left: "61%", top: "32%", width: "3%", height: "3%" },

  // Assam (yellow area in northeast)
  { id: "assam", left: "66%", top: "34%", width: "9%", height: "4%" },

  // Arunachal Pradesh (red area, far northeast)
  {
    id: "arunachal-pradesh",
    left: "70%",
    top: "28%",
    width: "10%",
    height: "6%",
  },

  // Nagaland (purple, small area in northeast)
  { id: "nagaland", left: "74%", top: "34%", width: "3%", height: "5%" },

  // Manipur (green area below Nagaland)
  { id: "manipur", left: "74%", top: "39%", width: "3%", height: "5%" },

  // Mizoram (red area, southeast of Manipur)
  { id: "mizoram", left: "71%", top: "44%", width: "3%", height: "5%" },

  // Tripura (green area)
  { id: "tripura", left: "69%", top: "44%", width: "3%", height: "4%" },

  // Meghalaya (yellow area)
  { id: "meghalaya", left: "67%", top: "38%", width: "5%", height: "3%" },

  // Rajasthan (large purple area on left)
  { id: "rajasthan", left: "24%", top: "30%", width: "15%", height: "12%" },

  // Gujarat (yellow area, southwest)
  { id: "gujarat", left: "23%", top: "44%", width: "10%", height: "16%" },

  // Madhya Pradesh (pink area, large central state)
  {
    id: "madhya-pradesh",
    left: "34%",
    top: "42%",
    width: "15%",
    height: "11%",
  },

  // Chhattisgarh (blue area, right of MP)
  { id: "chhattisgarh", left: "47%", top: "47%", width: "8%", height: "14%" },

  // Odisha (yellow-gold area on east coast)
  { id: "odisha", left: "52%", top: "52%", width: "10%", height: "11%" },

  // Maharashtra (large salmon/red area)
  { id: "maharashtra", left: "27%", top: "55%", width: "17%", height: "13%" },

  // Goa (small purple area on west coast)
  { id: "goa", left: "31%", top: "71%", width: "3%", height: "3%" },

  // Telangana (yellow area, center-south)
  { id: "telangana", left: "40%", top: "61%", width: "7%", height: "10%" },

  // Andhra Pradesh (pink area, southeast)
  {
    id: "andhra-pradesh",
    left: "41%",
    top: "70%",
    width: "10%",
    height: "12%",
  },

  // Karnataka (purple area, southwest)
  { id: "karnataka", left: "34%", top: "68%", width: "7%", height: "17%" },

  // Tamil Nadu (green area, far south)
  { id: "tamil-nadu", left: "40%", top: "81%", width: "6%", height: "14%" },

  // Kerala (red area on southwest coast)
  { id: "kerala", left: "35%", top: "85%", width: "4%", height: "13%" },
]

export default function IndiaArtMap() {
  const [selectedState, setSelectedState] = useState(null)
  const [hoveredState, setHoveredState] = useState(null)

  useEffect(() => {
    // Don't disable body scrolling when modal is open
    // Let the modal handle its own scrolling
  }, [selectedState])

  const handleStateClick = (stateId) => {
    setSelectedState(stateId)
  }

  const closeModal = () => {
    setSelectedState(null)
  }

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-purple-500/10 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white shadow-sm dark:bg-purple-600/10 p-2 sm:p-4">
        <h1 className="text-lg sm:text-2xl font-bold text-center text-gray-800 dark:text-white">
          Traditional Art Forms of India
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-1 dark:text-white/50">
          Click on any state to explore its traditional art form
        </p>
      </div>

      <div className="flex w-full h-full pt-16 sm:pt-20">
        {/* Map Container */}
        <div
          className={`relative transition-all duration-500 ease-in-out ${
            selectedState ? "w-1/2 lg:w-2/3" : "w-full"
          } h-full`}
        >
          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={selectedState ? closeModal : undefined}
          >
            {/* India Map */}
            <div className="relative max-w-4xl max-h-full w-full h-full">
              <img
                src="/India.png"
                alt="India Map"
                className={`w-full h-full object-contain ${selectedState ? "cursor-pointer" : ""}`}
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />

              {/* Invisible but clickable state areas */}
              <div className="absolute inset-0">
                {stateAreas.map((area) => (
                  <button
                    key={area.id}
                    className="absolute bg-transparent border-none cursor-pointer"
                    style={{
                      left: area.left,
                      top: area.top,
                      width: area.width,
                      height: area.height,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStateClick(area.id)
                    }}
                    onMouseEnter={() => setHoveredState(area.id)}
                    onMouseLeave={() => setHoveredState(null)}
                    aria-label={`Click to learn about ${stateData[area.id]?.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Hover tooltip */}
          {hoveredState && !selectedState && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-30 pointer-events-none">
              <p className="font-semibold">{stateData[hoveredState]?.name}</p>
              <p className="text-xs opacity-90">{stateData[hoveredState]?.artForm}</p>
            </div>
          )}
        </div>

        {/* Modal/Detail Panel - Responsive Design */}
        {selectedState && stateData[selectedState] && (
          <>
            {/* Mobile Modal Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeModal} />

            {/* Modal Content */}
            <div
              className={`
              fixed md:relative
              inset-x-0 bottom-0 md:inset-auto
              w-full md:w-1/2 lg:w-1/3
              h-3/4 md:h-full
              bg-white dark:bg-gray-950 
              border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 
              overflow-y-auto z-50
              rounded-t-2xl md:rounded-none
              transform transition-transform duration-300 ease-out
              translate-y-0
              top-20
            `}
            >
              {/* Background map image for modal */}
              <div className="absolute inset-0 opacity-10">
                <img src="/India.png" alt="India Map Background" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                {/* Mobile drag handle */}
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden" />

                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 pr-4">
                    {stateData[selectedState].name}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Art form visual representation - responsive */}
                  <div className="w-full h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white">
                    <div className="text-center px-4">
                      <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4">🎨</div>
                      <div className="text-base sm:text-lg lg:text-xl font-bold leading-tight">
                        {stateData[selectedState].artForm}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
                      About {stateData[selectedState].artForm}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                      {stateData[selectedState].description}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Traditional art form from <strong>{stateData[selectedState].name}</strong>
                    </p>
                  </div>

                  {/* Art form characteristics - responsive grid */}
                  <div className="bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 p-4 sm:p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm sm:text-base">
                      Cultural Heritage
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Region: {stateData[selectedState].name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-500 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Type: Traditional Handicraft
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Status: Living Heritage
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
                        <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                          Tradition: Centuries Old
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Instructions - Responsive Legend */}
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
        <h4 className="font-semibold mb-2 text-sm sm:text-base">How to explore</h4>
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
  )
}
