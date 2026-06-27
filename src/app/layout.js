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
      <body className="min-h-full flex flex-col bg-[#050505] text-[#d2e4f0] overflow-x-hidden selection:bg-[#8a0303] selection:text-white">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
