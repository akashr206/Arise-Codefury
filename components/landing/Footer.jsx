import { Button } from "@/components/ui/button"
import { cinzel } from "@/lib/fonts"
import { InstagramIcon } from "lucide-react"
import { Cinzel_Decorative } from "next/font/google"

export default function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="hidden sm:block absolute top-10 left-4 sm:left-10 w-12 h-12 sm:w-16 sm:h-16 border border-purple-500/20 rounded-full animate-float-slow"></div>
        <div className="hidden md:block absolute top-20 right-8 md:right-20 w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/10 rounded-full animate-pulse-slow"></div>
        <div className="hidden lg:block absolute bottom-20 left-1/4 w-10 h-10 sm:w-12 sm:h-12 border-2 border-purple-400/15 rotate-45 animate-spin-slow"></div>
        <div className="hidden sm:block absolute bottom-10 right-1/3 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>

        <div className="hidden md:block absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"></div>
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"></div>

        <div className="hidden sm:block absolute top-16 left-1/3 w-1 h-1 bg-purple-400/30 rounded-full animate-twinkle"></div>
        <div
          className="hidden md:block absolute top-32 right-1/4 w-1 h-1 bg-pink-400/30 rounded-full animate-twinkle"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="hidden lg:block absolute bottom-24 left-1/5 w-1 h-1 bg-purple-400/30 rounded-full animate-twinkle"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className={`text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 ${cinzel.className}`}>
              ARISE
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
              Preserving and promoting traditional Indian folk artforms in the digital age. Connecting artists with
              global audiences.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-transparent"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-transparent"
              >
                <InstagramIcon/>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-purple-50 dark:hover:bg-purple-950/20 bg-transparent"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="sm:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4">Traditional Art Forms</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  Warli Art
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  Pithora Paintings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  Madhubani Art
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  Gond Paintings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm sm:text-base text-muted-foreground hover:text-purple-600 transition-colors"
                >
                  Kalamkari
                </a>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-border/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2025 Arise. Preserving culture, empowering artists.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Supporting 500+ Artists
            </span>
            <span className="text-center">Made with ❤️ for Indian Culture</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
