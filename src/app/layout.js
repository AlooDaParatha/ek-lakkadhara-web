import { Inter, Cinzel, Special_Elite } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Ek Lakkadhara - Cursed Forest Psychological Horror Game",
  description: "Explore the remote mountains, survive the entity, and uncover the tragic legend of the Lumberjack in this single-player psychological survival horror game.",
  keywords: "Ek Lakkadhara, The Lumberjack, horror game, Unity horror, survival horror, psychological horror, cabin in the forest",
  openGraph: {
    title: "Ek Lakkadhara - Cursed Forest Psychological Horror Game",
    description: "Explore the remote mountains, survive the entity, and uncover the tragic legend of the Lumberjack.",
    images: [{ url: '/cabin.png' }],
  }
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cinzel.variable} ${specialElite.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/cabin.png" as="image" />
        <link rel="preload" href="/lumberjack.png" as="image" />
        <link rel="preload" href="/mill.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-[#d2e4f0] overflow-x-hidden selection:bg-[#8a0303] selection:text-white">
        {/* Pre-cache SVG shaders for instantaneous rendering */}
        <svg width="0" height="0" className="hidden absolute pointer-events-none" aria-hidden="true">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          </filter>
        </svg>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
