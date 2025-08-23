import { Button } from "@/components/ui/button"

export default function About() {
  return (
    <section className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large background shapes */}
        <div className="absolute top-20 left-2 sm:left-10 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-very-slow"></div>
        <div className="absolute bottom-20 right-2 sm:right-10 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-spin-slow"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-4 sm:right-20 w-8 h-8 sm:w-16 sm:h-16 border-2 border-purple-400/30 rotate-45 animate-float animation-delay-200"></div>
        <div className="absolute top-64 left-4 sm:left-32 w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full animate-float animation-delay-500"></div>
        <div className="absolute bottom-40 left-4 sm:left-20 w-10 h-10 sm:w-20 sm:h-20 border-2 border-yellow-400/30 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-32 right-4 sm:right-32 w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-br from-green-400/20 to-blue-400/20 rotate-12 animate-float animation-delay-800"></div>

        {/* Traditional art pattern inspired elements */}
        <div className="absolute top-48 left-2 sm:left-16 w-6 h-6 sm:w-8 sm:h-8 border-2 border-red-400/40 transform rotate-45 animate-twinkle animation-delay-300"></div>
        <div className="absolute top-80 right-4 sm:right-24 w-4 h-4 sm:w-6 sm:h-6 bg-yellow-400/30 rounded-full animate-twinkle animation-delay-600"></div>
        <div className="absolute bottom-64 left-6 sm:left-40 w-6 h-6 sm:w-10 sm:h-10 border-2 border-green-400/40 rounded-full animate-spin-slow"></div>

        {/* Constellation dots */}
        {/* <CHANGE> Fixed window check for SSR compatibility */}
        {[...Array(typeof window !== 'undefined' && window.innerWidth > 640 ? 15 : 8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-purple-400/40 rounded-full animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}

        {/* Artistic lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent animate-pulse animation-delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-pink-500 bg-clip-text text-transparent leading-tight px-2">
              Preserving Cultural Heritage
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              Bridging the gap between traditional Indian folk artforms and the digital age
            </p>
          </div>

          {/* Problem Statement */}
          <div className="mb-12 sm:mb-16 animate-fade-in-up animation-delay-200">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
                The Challenge We Face
              </h2>
              <div className="prose prose-lg max-w-none text-foreground">
                <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Traditional Indian folk artforms like <span className="font-semibold text-orange-400">Warli</span>,
                  <span className="font-semibold text-red-400"> Pithora</span>, and
                  <span className="font-semibold text-yellow-400"> Madhubani</span> are slowly fading due to limited
                  visibility and lack of modern platforms for promotion.
                </p>
                <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  Local artists struggle to reach wider audiences, and their cultural heritage risks being forgotten.
                  These magnificent art traditions, passed down through generations, deserve a place in our digital
                  world.
                </p>
              </div>
            </div>
          </div>

          {/* Our Solution */}
          <div className="mb-12 sm:mb-16 animate-fade-in-up animation-delay-400">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">
              Our Digital Solution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">P</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Preserve</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Digitally archive and document traditional artforms for future generations
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">P</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Promote</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Provide modern platforms for artists to showcase their incredible work
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/50 transition-all duration-300 sm:col-span-2 md:col-span-1">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold text-white">E</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Engage</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Create meaningful connections between artists and global audiences
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="mb-12 sm:mb-16 animate-fade-in-up animation-delay-600">
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-400/20 rounded-2xl p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Our Mission</h2>
              <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                To enable artists to showcase their work, connect with audiences, and sustain their livelihoods in the
                digital age while preserving the rich cultural heritage of traditional Indian folk art.
              </p>
            </div>
          </div>

          {/* Art Forms Showcase */}
          <div className="mb-12 sm:mb-16 animate-fade-in-up animation-delay-800">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center">Featured Art Forms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="group cursor-pointer">
                <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-orange-400">W</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Warli Art</h3>
                  <p className="text-muted-foreground text-sm">
                    Ancient tribal art form from Maharashtra featuring geometric patterns and nature motifs
                  </p>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-red-400">P</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Pithora Art</h3>
                  <p className="text-muted-foreground text-sm">
                    Vibrant ceremonial art from Gujarat and Rajasthan depicting horses and mythological stories
                  </p>
                </div>
              </div>

              <div className="group cursor-pointer sm:col-span-2 md:col-span-1">
                <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/50 transition-all duration-300 group-hover:scale-105">
                  <div className="w-full h-32 sm:h-48 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-yellow-400">M</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Madhubani Art</h3>
                  <p className="text-muted-foreground text-sm">
                    Intricate paintings from Bihar featuring religious themes and natural elements
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center animate-fade-in-up animation-delay-1000">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Join Our Cultural Revolution</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Be part of preserving and promoting India's rich artistic heritage for future generations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button
                size="lg"
                className="bg-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                Explore Artists
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 px-6 sm:px-8 py-3 bg-transparent w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
